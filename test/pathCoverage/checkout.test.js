'use strict';

const request = require('supertest');
const { expect } = require('chai');
const { BASE_URL } = require('../setup');

// Path coverage: POST /api/checkout
describe('Path: POST /api/checkout', function () {
  let token;

  // Checkout requires authentication; obtain a token with valid README credentials.
  before(async function () {
    const loginRes = await request(BASE_URL)
      .post('/api/login')
      .send({ username: 'alice', password: 'password123' });

    token = loginRes.body.token;
  });

  it('completes a checkout for an authenticated user and returns 200', async function () {
    // Valid cash order from the README checkout example (10% discount applies).
    const order = {
      items: [
        { productId: 1, quantity: 2 },
        { productId: 3, quantity: 1 },
      ],
      paymentMethod: 'cash',
    };

    const res = await request(BASE_URL)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send(order);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Checkout completed successfully.');
    expect(res.body.order).to.include({ paymentMethod: 'cash' });
    expect(res.body.order).to.have.property('subtotal', 209.97);
    expect(res.body.order).to.have.property('discount', 21.0);
    expect(res.body.order).to.have.property('total', 188.97);
  });
});
