const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const authenticate = require('../src/middleware/authenticate');
const { COOKIE_NAME } = require('../src/utils/auth');
const { createResponse, replace } = require('./helpers');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'unit-test-secret-at-least-32-characters';

test('authenticate rejects a missing token', async () => {
  const res = createResponse();
  let nextCalled = false;

  await authenticate({ cookies: {} }, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('authenticate rejects an invalid token', async () => {
  const res = createResponse();
  await authenticate({ cookies: { [COOKIE_NAME]: 'bad-token' } }, res, () => {});
  assert.equal(res.statusCode, 401);
});

test('authenticate attaches the user for a valid token', async (t) => {
  const user = { id: 'user-1', username: 'Person', email: 'person@example.com' };
  const originalFindById = User.findById;
  User.findById = (id) => {
    assert.equal(id, 'user-1');
    return { select: async (fields) => {
      assert.equal(fields, '_id username email profile');
      return user;
    } };
  };
  t.after(() => { User.findById = originalFindById; });
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1m', issuer: 'mern-api', audience: 'mern-client',
  });
  const req = { cookies: { [COOKIE_NAME]: token } };
  const res = createResponse();
  let nextCalled = false;

  await authenticate(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.user, user);
});

test('authenticate rejects a valid token when the account no longer exists', async (t) => {
  const originalFindById = User.findById;
  User.findById = () => ({ select: async () => null });
  t.after(() => { User.findById = originalFindById; });
  const token = jwt.sign({ sub: 'deleted-user' }, process.env.JWT_SECRET, {
    expiresIn: '1m', issuer: 'mern-api', audience: 'mern-client',
  });
  const res = createResponse();

  await authenticate({ cookies: { [COOKIE_NAME]: token } }, res, () => {});

  assert.equal(res.statusCode, 401);
});
