'use strict';

const request = require('supertest');
const { expect } = require('chai');
const { BASE_URL } = require('../setup');

// Path coverage: GET /api/healthcheck
describe('Path: GET /api/healthcheck', function () {
  it('returns 200 with API health status', async function () {
    const res = await request(BASE_URL).get('/api/healthcheck');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'ok');
    expect(res.body).to.have.property('timestamp');
  });
});
