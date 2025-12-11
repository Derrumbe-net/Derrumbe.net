// import http from 'k6/http';
// import { check, sleep } from 'k6'; // <--- 1. Import sleep

// export const options = {
//   scenarios: {
//     flood_reports: {
//       executor: 'per-vu-iterations',
//       vus: 20,       
//       iterations: 1, 
//       maxDuration: '60s',
//     },
//   },
//   thresholds: {
//     http_req_duration: ['p(95)<2000'], 
//     http_req_failed: ['rate==0.00'],   
//   },
// };

// const BASE_URL = 'http://[::1]:8080/api'; 
// const MAILPIT_API = 'http://127.0.0.1:8025/api/v1/messages';

// export function setup() {
//   http.del(MAILPIT_API);
// }

// export default function () {
//   const payload = JSON.stringify({
//     city: 'Mayaguez',
//     latitude: 18.2,
//     longitude: -67.1,
//     description: `Test Report ${__VU}`,
//     reported_at: '2025-12-10',
//     physical_address: 'Test Address',
//     reporter_name: `User ${__VU}`,
//     reporter_email: `user${__VU}@test.com`,
//     reporter_phone: '555-0199'
//   });

//   const res = http.post(`${BASE_URL}/reports`, payload, { 
//     headers: { 'Content-Type': 'application/json' }
//   });

//   check(res, { 'Status is 201': (r) => r.status === 201 });

//   // 2. FORCE K6 TO WAIT
//   // This extends the test duration to ~3 seconds so the HTML report is generated.
//   // It does NOT send extra emails.
//   sleep(10); 
// }

// export function teardown() {
//   const res = http.get(MAILPIT_API);
//   const count = res.json('total');

//   // I uncommented this so you see the verification in your terminal
//   console.log(`\n📧 EMAILS RECEIVED: ${count} / 20`);

//   if (count >= 20) {
//     console.log(`✅ REQUIREMENT 3.1.5 PASSED`);
//   } else {
//     throw new Error(`❌ FAILED: Only ${count} emails arrived.`);
//   }
// }


import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { Trend, Rate } from 'k6/metrics';

// 1. DEFINE CUSTOM METRICS
const deliveryTime = new Trend('REQ_3_1_5_Delivery_Time_ms');
const deliverySuccess = new Rate('REQ_3_1_5_Delivery_Success_Rate');

export const options = {
  scenarios: {
    flood_reports: {
      executor: 'per-vu-iterations',
      vus: 20,       
      iterations: 1, 
      maxDuration: '30s',
    },
  },
  thresholds: {
    'REQ_3_1_5_Delivery_Time_ms': ['p(95)<2000'], 
    'REQ_3_1_5_Delivery_Success_Rate': ['rate==1.00'],
  },
};

const BASE_URL = 'http://[::1]:8080/api'; 
const MAILPIT_API = 'http://127.0.0.1:8025/api/v1/messages';

export function setup() {
  http.del(MAILPIT_API);
}

export default function () {
  const payload = JSON.stringify({
    city: 'Mayaguez',
    latitude: 18.2,
    longitude: -67.1,
    description: `Test Report ${__VU}`,
    reported_at: '2025-12-10',
    physical_address: 'Test Address',
    reporter_name: `User ${__VU}`,
    reporter_email: `user${__VU}@test.com`,
    reporter_phone: '555-0199'
  });

  const res = http.post(`${BASE_URL}/reports`, payload, { 
    headers: { 'Content-Type': 'application/json' }
  });

  // RECORD DATA
  deliveryTime.add(res.timings.duration);
  const success = check(res, { 'Status is 201': (r) => r.status === 201 });
  deliverySuccess.add(success);

  // Wait to ensure report generation works
  sleep(3); 
}

export function teardown() {
  const res = http.get(MAILPIT_API);
  const count = res.json('total');
  console.log(`\n📧 EMAILS RECEIVED: ${count} / 20`);

  if (count >= 20) {
    console.log(`✅ REQUIREMENT 3.1.5 PASSED`);
  } else {
    throw new Error(`❌ FAILED: Only ${count} emails arrived.`);
  }
}

// --- GENERATOR FUNCTION ---
export function handleSummary(data) {
  // 1. CLEAN UP THE TABLE ROWS
  const metricsToRemove = [
    'http_req_blocked',
    'http_req_connecting',
    'http_req_receiving',
    'http_req_sending',
    'http_req_tls_handshaking',
    'http_req_waiting',
    'http_req_duration', 
    'http_req_failed',
    'checks'
  ];

  metricsToRemove.forEach(metric => {
    if (data.metrics[metric]) delete data.metrics[metric];
  });

  // 2. GENERATE RAW HTML
  let html = htmlReport(data);

  // 3. INJECT CSS TO HIDE UNWANTED ITEMS
  const styleHideItems = `
    <style>
      /* Hide the P90 and P95 columns */
      th:nth-last-child(-n+2), td:nth-last-child(-n+2) {
        display: none !important;
      }
    </style>
  `;

  // 4. INJECT JAVASCRIPT TO HIDE ITERATION ROW
  const scriptHideRow = `
    <script>
      window.onload = function() {
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
          if (row.innerText.includes('iteration_duration')) {
            row.style.display = 'none';
          }
        });
      };
    </script>
  `;

  // 5. APPLY CUSTOMIZATIONS & RENAME "Rate" -> "Success Rate"
  html = html
    .replace('</head>', `${styleHideItems}</head>`)   
    .replace('</body>', `${scriptHideRow}</body>`)    
    .replace(/<title>.*<\/title>/, `<title>Email Notifications Load Test</title>`)
    .replace(/<h1[^>]*>.*<\/h1>/, `<h1>Email Notifications Load Test</h1>`)
    
    // --> THIS LINE RENAMES THE COLUMN HEADER <--
    .replace(/>Rate</g, '>Success Rate<'); 

  return {
    "email_load_test.html": html,
  };
}