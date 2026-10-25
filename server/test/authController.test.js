const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const controller = require('../src/controllers/authController');
const { COOKIE_NAME } = require('../src/utils/auth');
const { createResponse, replace } = require('./helpers');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'unit-test-secret-at-least-32-characters';

const restore = [];
afterEach(() => {
  while (restore.length) restore.pop()();
});

test('register validates input and does not create a user for invalid data', async () => {
  let createCalled = false;
  restore.push(replace(User, 'create', async () => { createCalled = true; }));
  const res = createResponse();
  let forwardedError;

  await controller.register({ body: { username: 'a', email: 'invalid', password: 'short' } }, res, (error) => {
    forwardedError = error;
  });

  assert.equal(forwardedError.status, 400);
  assert.ok(forwardedError.details.length >= 1);
  assert.equal(createCalled, false);
});

test('register hashes password, normalizes email, sets auth cookie, and returns public user', async () => {
  restore.push(replace(User, 'exists', async (query) => {
    assert.deepEqual(query, { email: 'person@example.com' });
    return false;
  }));
  restore.push(replace(User, 'create', async (data) => {
    assert.equal(data.username, 'Person');
    assert.equal(data.email, 'person@example.com');
    assert.notEqual(data.password, 'correct horse battery staple');
    assert.equal(await bcrypt.compare('correct horse battery staple', data.password), true);
    return { id: 'user-1', username: data.username, email: data.email };
  }));
  const res = createResponse();

  await controller.register({
    body: { username: 'Person', email: 'PERSON@example.com', password: 'correct horse battery staple' },
  }, res, (error) => { throw error; });

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, { id: 'user-1', username: 'Person', email: 'person@example.com' });
  assert.equal(res.cookies[0].name, COOKIE_NAME);
  assert.equal(res.cookies[0].options.httpOnly, true);
});

test('register returns conflict when email already exists', async () => {
  restore.push(replace(User, 'exists', async () => true));
  const res = createResponse();

  await controller.register({
    body: { username: 'Person', email: 'person@example.com', password: 'password123' },
  }, res, (error) => { throw error; });

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /already exists/i);
  assert.equal(res.cookies.length, 0);
});

test('login returns generic unauthorized response for incorrect password', async () => {
  const passwordHash = await bcrypt.hash('right-password', 4);
  restore.push(replace(User, 'findOne', () => ({
    select: async (field) => {
      assert.equal(field, '+password');
      return { password: passwordHash };
    },
  })));
  const res = createResponse();

  await controller.login({ body: { email: 'person@example.com', password: 'wrong-password' } }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: 'Invalid email or password.' });
  assert.equal(res.cookies.length, 0);
});

test('login returns public user and sets cookie for valid credentials', async () => {
  const passwordHash = await bcrypt.hash('right-password', 4);
  restore.push(replace(User, 'findOne', (query) => {
    assert.deepEqual(query, { email: 'person@example.com' });
    return { select: async () => ({
      id: 'user-1', username: 'Person', email: 'person@example.com', password: passwordHash,
    }) };
  }));
  const res = createResponse();

  await controller.login({ body: { email: 'PERSON@example.com', password: 'right-password' } }, res, (error) => {
    throw error;
  });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { id: 'user-1', username: 'Person', email: 'person@example.com' });
  assert.equal(res.cookies[0].name, COOKIE_NAME);
});

test('logout clears the auth cookie', () => {
  const res = createResponse();
  controller.logout({}, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.clearedCookies[0].name, COOKIE_NAME);
});

test('me only returns the public user fields', () => {
  const res = createResponse();
  controller.me({ user: { id: 'user-1', username: 'Person', email: 'person@example.com', password: 'secret' } }, res);
  assert.deepEqual(res.body, { id: 'user-1', username: 'Person', email: 'person@example.com' });
});
