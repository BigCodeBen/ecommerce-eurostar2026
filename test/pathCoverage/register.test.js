'use strict';

const request = require('supertest');
const { expect } = require('chai');
const { BASE_URL } = require('../setup');

// Path coverage: POST /api/register
describe('Path: POST /api/register', function () {
  it('registers a new user and returns 201', async function () {
    // Valid registration payload based on the README example.
    // A unique username/email avoids 409 conflicts across runs.
    const unique = Date.now();
    const newUser = {
      username: `dave_${unique}`,
      email: `dave_${unique}@example.com`,
      password: 'securepass',
    };

    const res = await request(BASE_URL)
      .post('/api/register')
      .send(newUser);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'User registered successfully.');
    expect(res.body.user).to.include({
      username: newUser.username,
      email: newUser.email,
    });
    expect(res.body.user).to.have.property('id');
  });
});
