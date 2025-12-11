import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// 1. CONFIGURATION
const BASE_URL = 'http://[::1]:8080/api'; 

const successfulReports = new Rate('successful_reports');

export const options = {
    scenarios: {
      landslide_reporting: {
        executor: 'constant-vus',
        vus: 20,
        duration: '30s', // Run for 30 seconds to generate graph data
      },
    },
    thresholds: {
      'successful_reports': ['rate>=0.95'], 
      'http_req_duration': ['p(95)<2000'], 
    },
  };

export default function () {
  const metadataPayload = JSON.stringify({
    landslide_id: '2', 
    reported_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    description: 'K6 Stress Test Report',
    city: 'Mayagüez',
    latitude: '18.2013',
    longitude: '-67.1452',
    reporter_name: 'K6 Bot',
    reporter_phone: '555-0199',
    reporter_email: 'k6@test.com',
    physical_address: 'Load Test Ave',
  });

  //  Add Headers so PHP knows this is JSON
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Use standard backticks ` ` for the URL
  const resMeta = http.post(`${BASE_URL}/reports`, metadataPayload, params);

  const metaSuccess = check(resMeta, {
    'Metadata Created (201)': (r) => r.status === 201 || r.status === 200,
    'Has Report ID': (r) => r.json('report_id') !== undefined || r.json('id') !== undefined,
  });

  if (!metaSuccess) {
    console.error(`Failed: ${resMeta.status} ${resMeta.body}`);
  }

  // Mark success based ONLY on metadata creation
  successfulReports.add(metaSuccess);

sleep(1);
}