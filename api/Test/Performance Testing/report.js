import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { Rate, Counter, Trend } from 'k6/metrics';

const submissionSuccess = new Rate('REQ_3_1_4_Submission_Success_Rate');
// We still need this counter for the data, even if we hide the main table later
const reportsCreated = new Counter('REQ_3_1_4_Total_Reports_Submitted');
const submissionTime = new Trend('REQ_3_1_4_Submission_Time_ms'); 

export const options = {
  scenarios: {
    landslide_reporting: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s', 
    },
  },
  thresholds: {
    'REQ_3_1_4_Submission_Success_Rate': ['rate>=0.95'], 
  },
};

const BASE_URL = 'http://[::1]:8080/api'; 

export default function () {
  const metadataPayload = JSON.stringify({
    landslide_id: '2', 
    reported_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    description: `K6 Stress Test Report ${__VU}-${__ITER}`,
    city: 'Mayagüez',
    latitude: '18.2013',
    longitude: '-67.1452',
    reporter_name: `K6 Bot ${__VU}`,
    reporter_phone: '555-0199',
    reporter_email: 'k6@test.com',
    physical_address: 'Load Test Ave',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/reports`, metadataPayload, params);

  // --- RECORD METRICS ---
  submissionTime.add(res.timings.duration);

  const isSuccess = check(res, {
    'Report Created (200/201)': (r) => r.status === 201 || r.status === 200,
  });
  submissionSuccess.add(isSuccess);
  
  if (isSuccess) {
    reportsCreated.add(1);
  } else {
    console.error(`Failed: ${res.status} ${res.body}`);
  }

  sleep(1);
}

// --- CLEAN REPORT GENERATION ---
export function handleSummary(data) {
  const metricsToRemove = [
    'http_req_blocked',
    'http_req_connecting',
    'http_req_receiving',
    'http_req_sending',
    'http_req_tls_handshaking',
    'http_req_waiting',
    'http_req_duration', 
    'http_req_failed',
    'checks',
    'iteration_duration'
  ];

  metricsToRemove.forEach(metric => {
    if (data.metrics[metric]) delete data.metrics[metric];
  });

  let html = htmlReport(data);

  // CSS to hide P90/P95 columns. 
  // Removed the old CSS that made counter text transparent since we hide the whole section now.
  const styleHideItems = `
    <style>
      /* Hide P90 and P95 columns */
      th:nth-last-child(-n+2), td:nth-last-child(-n+2) {
        display: none !important;
      }
    </style>
  `;

  // UPDATED JAVASCRIPT TO HIDE THE COUNTERS SECTION
  const scriptHideSections = `
    <script>
      window.onload = function() {
        // 1. Hide Iteration Row & Rename Rate Header
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
          if (row.innerText.includes('iteration_duration')) {
            row.style.display = 'none';
          }
          if (row.innerHTML.includes('>Rate<')) {
            row.innerHTML = row.innerHTML.replace('>Rate<', '>Success Rate<');
          }
        });

        // 2. HIDE THE ENTIRE COUNTERS SECTION
        const headers = document.querySelectorAll('h2');
        headers.forEach(h2 => {
           // Find the header that says "Counters"
           if (h2.innerText.trim() === 'Counters') {
               // Hide the header itself
               h2.style.display = 'none';
               // Find and hide the table immediately following it
               let nextElem = h2.nextElementSibling;
               while (nextElem) {
                   if (nextElem.tagName === 'TABLE') {
                       nextElem.style.display = 'none';
                       break; // Stop after hiding the table
                   }
                   nextElem = nextElem.nextElementSibling;
               }
           }
        });
      };
    </script>
  `;

  const customTitle = "Reporting Stress Test";

  html = html
    .replace('</head>', `${styleHideItems}</head>`)
    .replace('</body>', `${scriptHideSections}</body>`) // Injected the updated script here
    .replace(/<title>.*<\/title>/, `<title>${customTitle}</title>`)
    .replace(/<h1[^>]*>.*<\/h1>/, `<h1>${customTitle}</h1>`);

  return {
    "report_stress_test.html": html,
  };
}