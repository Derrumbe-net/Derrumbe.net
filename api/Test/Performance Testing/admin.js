import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { Trend, Rate, Counter } from 'k6/metrics';
import { b64decode } from 'k6/encoding';

// 1. DEFINE CUSTOM METRICS (Aligned with Obj 3.1.3)
const crudAvgTime = new Trend('REQ_3_1_3_CRUD_Avg_Time_ms');
const crudSuccessRate = new Rate('REQ_3_1_3_CRUD_Success_Rate');
const totalCrudRequests = new Counter('REQ_3_1_3_Total_CRUD_Ops');

// --- CONFIGURATION ---
export const options = {
  vus: 10,       
  duration: '30s',
  thresholds: {
    // 2. APPLY THRESHOLDS TO OUR CUSTOM METRICS
    'REQ_3_1_3_CRUD_Avg_Time_ms': ['avg<2000'], // Average Response Time <= 2 seconds (2000ms)
    'REQ_3_1_3_CRUD_Success_Rate': ['rate>=0.95'], // Task Completion Rate >= 95%
  },
};

const BASE_URL = 'http://[::1]:8080/api'; 
const ADMIN_EMAIL = 'slidespr@gmail.com';
const ADMIN_PASSWORD = 'UPRM_F-414_admin';

// --- HELPERS ---

function debugError(response, context) {
  if (response.status >= 400) {
    console.error(`[${context}] Failed: ${response.status} | Body: ${response.body}`);
  }
}

function getUniqueId() {
  return `${__VU}_${__ITER}_${Date.now()}`;
}

// Helper to run CRUD operation and record metrics
function runCrudOp(method, url, payload, tags, expectedStatus, authHeaders) {
    const res = http.request(method, url, payload ? payload : null, { headers: authHeaders, tags: tags });
    debugError(res, tags.name);

    // Record time and total requests
    crudAvgTime.add(res.timings.duration);
    totalCrudRequests.add(1);

    // Record success
    const success = check(res, { 
        [tags.name + ' Status ' + expectedStatus]: (r) => Array.isArray(expectedStatus) ? expectedStatus.includes(r.status) : r.status === expectedStatus 
    });
    crudSuccessRate.add(success);
    
    return res;
}

// ===========================================================================
// SETUP: LOGIN
// ===========================================================================
export function setup() {
  const loginRes = http.post(`${BASE_URL}/admins/login`, JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  }), { 
    headers: { 'Content-Type': 'application/json' }
  });

  if (loginRes.status !== 200) {
    throw new Error(`Setup failed: Unable to login. ${loginRes.body}`);
  }

  const token = loginRes.json('token');
  return { token: token }; 
}

// ===========================================================================
// MAIN TEST: CRUD OPERATIONS (FIXED PAYLOADS)
// ===========================================================================
export default function (data) {
  const uniqueId = getUniqueId();
  const token = data.token;

  // --- FIXED: ROBUST JWT DECODING ---
  const tokenParts = token.split('.');
  const decodedPayload = JSON.parse(String.fromCharCode(...new Uint8Array(b64decode(tokenParts[1], 'rawurl'))));
  const adminId = decodedPayload.sub; 
  
  if (!adminId) {
      throw new Error("CRITICAL: Admin ID is missing from the decoded token.");
  }
  // ------------------------------------

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  let id;
  
  // --- SUITE 1: LANDSLIDE ---
  {
    const createPayload = JSON.stringify({
      admin_id: adminId, city: 'Mayaguez', latitude: 18.201, longitude: -67.14, description: `K6 Test Landslide ${uniqueId}`, landslide_date: '2025-12-10', image_url: 'default_landslide.jpg' 
    });
    
    let createRes = runCrudOp('POST', `${BASE_URL}/landslides`, createPayload, { name: 'Landslide_Create' }, [200, 201], authHeaders);

    if (createRes.status < 400) {
      const id = createRes.json('id') || createRes.json('landslide_id'); 
      
      // Read
      runCrudOp('GET', `${BASE_URL}/landslides/${id}`, null, { name: 'Landslide_Read' }, 200, authHeaders);

      // --- FIX: Complete Update Payload ---
      const updatePayload = JSON.stringify({ 
        admin_id: adminId,
        landslide_date: '2025-12-10', // REQUIRED FIELD
        latitude: 18.201,             // REQUIRED FIELD
        longitude: -67.14,            // REQUIRED FIELD
        description: `Updated Landslide ${uniqueId}`,
        image_url: 'default_landslide.jpg' // Added for completeness
      });
      runCrudOp('PUT', `${BASE_URL}/landslides/${id}`, updatePayload, { name: 'Landslide_Update' }, [200, 204], authHeaders);

      // Delete
      runCrudOp('DELETE', `${BASE_URL}/landslides/${id}`, null, { name: 'Landslide_Delete' }, [200, 204], authHeaders);
    }
  }

  // --- SUITE 2: PROJECT ---
  {
    const createPayload = JSON.stringify({
      admin_id: adminId, title: `K6 Project ${uniqueId}`, description: 'Load testing project creation', content: 'Content...', date_published: '2025-01-01'
    });
    
    let createRes = runCrudOp('POST', `${BASE_URL}/projects`, createPayload, { name: 'Project_Create' }, [200, 201], authHeaders);

    if (createRes.status < 400) {
      const id = createRes.json('id') || createRes.json('project_id');

      // Read
      runCrudOp('GET', `${BASE_URL}/projects/${id}`, null, { name: 'Project_Read' }, 200, authHeaders);

      // --- FIX: Complete Update Payload ---
      const updatePayload = JSON.stringify({
        admin_id: adminId,
        title: `Updated Project ${uniqueId}`, 
        description: 'Updated description', 
        content: 'Content...', 
        date_published: '2025-01-01' 
      });
      runCrudOp('PUT', `${BASE_URL}/projects/${id}`, updatePayload, { name: 'Project_Update' }, [200, 204], authHeaders);

      // Delete
      runCrudOp('DELETE', `${BASE_URL}/projects/${id}`, null, { name: 'Project_Delete' }, [200, 204], authHeaders);
    }
  }

  // --- SUITE 3: PUBLICATION ---
  {
    const createPayload = JSON.stringify({
      admin_id: adminId, title: `K6 Publication ${uniqueId}`, author: 'Dr. K6 Load Tester', description: 'Safety guidelines.', publication_url: `https://example.com/pub/${uniqueId}`, image_url: `https://example.com/img/${uniqueId}.jpg`
    });

    let createRes = runCrudOp('POST', `${BASE_URL}/publications`, createPayload, { name: 'Publication_Create' }, [200, 201], authHeaders);

    if (createRes.status < 400) {
      const id = createRes.json('id') || createRes.json('publication_id');

      // Read
      runCrudOp('GET', `${BASE_URL}/publications/${id}`, null, { name: 'Publication_Read' }, 200, authHeaders);

      // --- FIX: Complete Update Payload ---
      const updatePayload = JSON.stringify({ 
        admin_id: adminId, 
        title: `K6 Publication ${uniqueId}`, 
        author: 'Dr. Updated Author', 
        description: 'Safety guidelines.', 
        publication_url: `https://example.com/pub/${uniqueId}`, 
        image_url: `https://example.com/img/${uniqueId}.jpg` 
      });
      runCrudOp('PUT', `${BASE_URL}/publications/${id}`, updatePayload, { name: 'Publication_Update' }, [200, 204], authHeaders);

      // Delete
      runCrudOp('DELETE', `${BASE_URL}/publications/${id}`, null, { name: 'Publication_Delete' }, [200, 204], authHeaders);
    }
  }

  // --- SUITE 4: STATION ---
  {
    const createPayload = JSON.stringify({
      admin_id: adminId, station_name: `Station_${uniqueId}`, latitude: 18.1234, longitude: -67.9876, elevation: 100, status: 'Active', soil_saturation: 50.5, is_available: 1, image_url: 'default_station.jpg'
    });
    
    let createRes = runCrudOp('POST', `${BASE_URL}/stations`, createPayload, { name: 'Station_Create' }, [200, 201], authHeaders);

    if (createRes.status < 400) {
      const id = createRes.json('id') || createRes.json('station_id');

      // Read
      runCrudOp('GET', `${BASE_URL}/stations/${id}`, null, { name: 'Station_Read' }, 200, authHeaders);

      // --- FIX: Complete Update Payload ---
      const updatePayload = JSON.stringify({
        admin_id: adminId,
        station_name: `Station_${uniqueId}`, 
        latitude: 18.1234, 
        longitude: -67.9876, 
        elevation: 100, 
        status: 'Inactive',
        soil_saturation: 50.5, 
        is_available: 1, 
        image_url: 'default_station.jpg' 
      });
      
      runCrudOp('PUT', `${BASE_URL}/stations/${id}`, updatePayload, { name: 'Station_Update' }, [200, 204], authHeaders);

      // Delete
      runCrudOp('DELETE', `${BASE_URL}/stations/${id}`, null, { name: 'Station_Delete' }, [200, 204], authHeaders);
    }
  }

  sleep(1);
}

// ===========================================================================
// REPORT GENERATION (CLEANUP)
// ===========================================================================
export function handleSummary(data) {
  // 3. CLEAN UP THE TABLE ROWS (Keep the essential data needed for the header/crash prevention)
  const metricsToRemove = [
    'http_req_blocked', 'http_req_connecting', 'http_req_receiving', 'http_req_sending',
    'http_req_tls_handshaking', 'http_req_waiting', 'http_req_duration', 'http_req_failed',
    'checks', 'iteration_duration', // We hide iteration duration via JS, but remove checks/duration for cleanliness
  ];

  metricsToRemove.forEach(metric => {
    if (data.metrics[metric]) delete data.metrics[metric];
  });

  let html = htmlReport(data);

  // 4. INJECT CSS/JS TO CLEAN UP REPORT VISUALLY
  const styleHideItems = `
    <style>
      /* Hide the P90 and P95 columns */
      th:nth-last-child(-n+2), td:nth-last-child(-n+2) {
        display: none !important;
      }
    </style>
  `;

  const scriptHideSections = `
    <script>
      window.onload = function() {
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
          // Hide iteration_duration row
          if (row.innerText.includes('iteration_duration')) {
            row.style.display = 'none';
          }
          // Rename 'Rate' -> 'Success Rate'
          if (row.innerHTML.includes('>Rate<')) {
            row.innerHTML = row.innerHTML.replace('>Rate<', '>Success Rate<');
          }
        });
        // Hide the 'Counters', 'Rates', and 'Checks' sections visually
        document.querySelectorAll('h2').forEach(h2 => {
           if (h2.innerText.trim() === 'Counters' || h2.innerText.trim() === 'Rates' || h2.innerText.trim() === 'Checks') {
               h2.style.display = 'none';
               let nextElem = h2.nextElementSibling;
               if (nextElem && nextElem.tagName === 'TABLE') {
                   nextElem.style.display = 'none';
               }
           }
        });
      };
    </script>
  `;

  // 5. APPLY CUSTOM TITLE
  const customTitle = "Admin Manage CRUD Operations (3.1.3)";

  html = html
    .replace('</head>', `${styleHideItems}</head>`)
    .replace('</body>', `${scriptHideSections}</body>`)
    .replace(/<title>.*<\/title>/, `<title>${customTitle}</title>`)
    .replace(/<h1[^>]*>.*<\/h1>/, `<h1>${customTitle}</h1>`);

  return {
    "admin_crud_report.html": html,
  };
}