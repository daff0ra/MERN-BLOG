const { after, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

test('GET /robots.txt returns plain-text crawler rules that exclude the API', async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;

  const response = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/plain/);
  assert.equal(await response.text(), 'User-agent: *\nDisallow: /api/\n');
});

after(() => new Promise((resolve, reject) => {
  if (!server) return resolve();
  server.close((error) => error ? reject(error) : resolve());
}));
