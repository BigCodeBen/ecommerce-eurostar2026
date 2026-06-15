'use strict';

// Root hook plugin: boot the real Express server over HTTP before the suite
// runs and shut it down afterwards. Tests target this live HTTP instance via
// Supertest (a base URL string), never the in-process `app` object.
const app = require('../src/app');

const TEST_PORT = process.env.TEST_PORT || 3000;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let server;

exports.mochaHooks = {
  beforeAll(done) {
    server = app.listen(TEST_PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Test server listening on ${BASE_URL}`);
      done();
    });
  },
  afterAll(done) {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  },
};

exports.BASE_URL = BASE_URL;
