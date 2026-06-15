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
    let settled = false;
    const finish = (err) => {
      if (settled) return;
      settled = true;
      done(err);
    };

    server = app.listen(TEST_PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Test server listening on ${BASE_URL}`);
      finish();
    });
    server.on('error', (err) => {
      // In CI the API is already started in the background on TEST_PORT, so the
      // port is busy. Reuse that running instance instead of failing the suite.
      if (err.code === 'EADDRINUSE') {
        server = null;
        // eslint-disable-next-line no-console
        console.log(`Reusing API already running on ${BASE_URL}`);
        finish();
      } else {
        finish(err);
      }
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
