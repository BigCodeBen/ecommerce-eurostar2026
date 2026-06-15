import http from 'k6/http';
import { check } from 'k6';

/**
 * K6 load test for the Login endpoint.
 *
 * Endpoint (from swagger.yaml): POST http://localhost:3000/api/login
 * Test data (from README.md):    username "alice" / password "password123"
 *
 * Requirements:
 *  - Threshold: 95th percentile response time < 500ms
 *  - Load profile: 10 VUs over the first 5s, ramp to 30 VUs over the next 20s,
 *    then ramp down to 0 VUs over the final 5s (30s total).
 */

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

export const options = {
  stages: [
    { duration: '5s', target: 10 }, // ramp up to 10 VUs in the first 5s
    { duration: '20s', target: 30 }, // ramp up to 30 VUs over the next 20s
    { duration: '5s', target: 0 }, // ramp down to 0 VUs over the final 5s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95th percentile must stay under 500ms
  },
};

// Valid credentials taken from README.md (password for all seeded users is "password123").
const credentials = {
  username: 'alice',
  password: 'password123',
};

export default function () {
  const payload = JSON.stringify(credentials);
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/login`, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has a token': (r) => {
      try {
        return typeof r.json('token') === 'string' && r.json('token').length > 0;
      } catch (_e) {
        return false;
      }
    },
  });
}
