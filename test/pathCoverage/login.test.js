'use strict';

const request = require('supertest');
const { expect } = require('chai');
const { BASE_URL } = require('../setup');

// Path coverage: POST /api/login
describe('Path: POST /api/login', function () {
  it('authenticates an existing user and returns a JWT token', async function () {
    // Valid credentials from the README "Existent Data" section.
    const credentials = { username: 'alice', password: 'password123' };

    const res = await request(BASE_URL)
      .post('/api/login')
      .send(credentials);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Login successful.');
    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body.user).to.include({
      username: 'alice',
      email: 'alice@example.com',
    });
  });
});
