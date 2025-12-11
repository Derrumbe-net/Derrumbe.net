import http from 'k6/http';
import { check, sleep } from 'k6';
import { b64decode } from 'k6/encoding';

// --- CONFIGURATION ---
export const options = {
  vus: 10,       
  duration: '30s',
  thresholds: {
    http_req_duration: ['avg<2000'], // Average CRUD time <= 2s
    http_req_failed: ['rate<0.05'],  // Failure rate < 5% (Success >= 95%)
  },
};

const BASE_URL = 'http://[::1]:8080/api'; 
const ADMIN_EMAIL = 'slidespr@gmail.com';
const ADMIN_PASSWORD = 'UPRM_F-414_admin';

// --- HELPER: JWT DECODER ---
function getAdminIdFromToken(token) {
  try {
    const parts = token.split('.');
    const decodedBin = b64decode(parts[1], 'rawurl'); 
    const decodedString = String.fromCharCode(...new Uint8Array(decodedBin));
    return JSON.parse(decodedString).sub; 
  } catch (e) {
    console.error(`JWT Decode Error: ${e.message}`);
    return null;
  }
}

function debugError(response, context) {
  if (response.status >= 400) {
    console.error(`[${context}] Failed: ${response.status} | Body: ${response.body}`);
  }
}

function getUniqueId() {
  return `${__VU}_${__ITER}_${Date.now()}`;
}

// ===========================================================================
// SETUP: RUNS ONCE BEFORE TEST STARTS
// This handles authentication so it doesn't pollute your test metrics.
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
  return { token: token }; // This object is passed to the default function
}

// ===========================================================================
// MAIN TEST: CRUD OPERATIONS ONLY
// ===========================================================================
export default function (data) {
  const uniqueId = getUniqueId();
  
  // Reuse the token from setup()
  const token = data.token;
  const adminId = getAdminIdFromToken(token); // Decode locally (fast, no request)

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // --- SUITE 1: LANDSLIDE ---
  {
    const payload = JSON.stringify({
      admin_id: adminId, 
      city: 'Mayaguez',
      latitude: 18.201,
      longitude: -67.14,
      description: `K6 Test Landslide ${uniqueId}`,
      landslide_date: '2025-12-10', 
      image_url: 'default_landslide.jpg' 
    });
    
    const create = http.post(`${BASE_URL}/landslides`, payload, { headers: authHeaders, tags: { name: 'Create_Landslide' } });
    debugError(create, "Landslide Create");

    if (check(create, { 'Landslide Create 200/201': (r) => r.status === 200 || r.status === 201 })) {
      const id = create.json('id') || create.json('landslide_id'); 

      check(http.get(`${BASE_URL}/landslides/${id}`, { headers: authHeaders, tags: { name: 'Read_Landslide' } }), {
        'Landslide Read 200': (r) => r.status === 200
      });

      const updatePayload = JSON.stringify({ 
        admin_id: adminId,
        landslide_date: '2025-12-10',
        latitude: 18.201,
        longitude: -67.14,
        image_url: 'default_landslide.jpg',
        description: `Updated Description ${uniqueId}` 
      });

      http.put(`${BASE_URL}/landslides/${id}`, updatePayload, { headers: authHeaders, tags: { name: 'Update_Landslide' } });

      http.del(`${BASE_URL}/landslides/${id}`, null, { headers: authHeaders, tags: { name: 'Delete_Landslide' } });
    }
  }

  // --- SUITE 2: PROJECT ---
  {
    const payload = JSON.stringify({
      admin_id: adminId, 
      title: `K6 Project ${uniqueId}`,
      description: 'Load testing project creation',
      content: 'Content...',
      date_published: '2025-01-01'
    });
    
    const create = http.post(`${BASE_URL}/projects`, payload, { headers: authHeaders, tags: { name: 'Create_Project' } });
    debugError(create, "Project Create");

    if (check(create, { 'Project Create 200/201': (r) => r.status === 200 || r.status === 201 })) {
      const id = create.json('id') || create.json('project_id');

      check(http.get(`${BASE_URL}/projects/${id}`, { headers: authHeaders, tags: { name: 'Read_Project' } }), {
        'Project Read 200': (r) => r.status === 200
      });

      const updatePayload = JSON.stringify({ 
        admin_id: adminId,
        title: `Updated Project ${uniqueId}`,
        description: 'Updated description',
        content: 'Content...',
        date_published: '2025-01-01'
      });

      http.put(`${BASE_URL}/projects/${id}`, updatePayload, { headers: authHeaders, tags: { name: 'Update_Project' } });

      http.del(`${BASE_URL}/projects/${id}`, null, { headers: authHeaders, tags: { name: 'Delete_Project' } });
    }
  }

  // --- SUITE 3: PUBLICATION ---
  {
    const payload = JSON.stringify({
      admin_id: adminId,
      title: `K6 Publication ${uniqueId}`,
      author: 'Dr. K6 Load Tester',
      description: 'Safety guidelines.',
      publication_url: `https://example.com/pub/${uniqueId}`,
      image_url: `https://example.com/img/${uniqueId}.jpg`
    });

    const create = http.post(`${BASE_URL}/publications`, payload, { headers: authHeaders, tags: { name: 'Create_Publication' } });
    debugError(create, "Publication Create");

    if (check(create, { 'Publication Create 200/201': (r) => r.status === 200 || r.status === 201 })) {
      const id = create.json('id') || create.json('publication_id');

      check(http.get(`${BASE_URL}/publications/${id}`, { headers: authHeaders, tags: { name: 'Read_Publication' } }), {
        'Publication Read 200': (r) => r.status === 200
      });

      const updatePayload = JSON.stringify({ 
        admin_id: adminId,
        author: 'Dr. Updated Author' 
      });

      http.put(`${BASE_URL}/publications/${id}`, updatePayload, { headers: authHeaders, tags: { name: 'Update_Publication' } });

      http.del(`${BASE_URL}/publications/${id}`, null, { headers: authHeaders, tags: { name: 'Delete_Publication' } });
    }
  }

  // --- SUITE 4: STATION ---
  {
    const payload = JSON.stringify({
      admin_id: adminId,
      station_name: `Station_${uniqueId}`,
      latitude: 18.1234,
      longitude: -67.9876,
      elevation: 100,
      status: 'Active',
      soil_saturation: 50.5, 
      is_available: 1,       
      image_url: 'default_station.jpg'
    });
    
    const create = http.post(`${BASE_URL}/stations`, payload, { headers: authHeaders, tags: { name: 'Create_Station' } });
    debugError(create, "Station Create");

    if (check(create, { 'Station Create 200/201': (r) => r.status === 200 || r.status === 201 })) {
      const id = create.json('id') || create.json('station_id');

      check(http.get(`${BASE_URL}/stations/${id}`, { headers: authHeaders, tags: { name: 'Read_Station' } }), {
        'Station Read 200': (r) => r.status === 200
      });

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
      
      http.put(`${BASE_URL}/stations/${id}`, updatePayload, { headers: authHeaders, tags: { name: 'Update_Station' } });

      http.del(`${BASE_URL}/stations/${id}`, null, { headers: authHeaders, tags: { name: 'Delete_Station' } });
    }
  }

  sleep(1);
}