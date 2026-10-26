const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const User = require('../src/models/User');
const controller = require('../src/controllers/profileController');
const { createResponse, replace } = require('./helpers');

const restore = [];
afterEach(() => {
  while (restore.length) restore.pop()();
});

test('get returns profile fields and falls back to username for display name', () => {
  const res = createResponse();
  controller.get({ user: { username: 'Person', profile: { summary: 'Builder', skills: ['Node.js'] } } }, res);

  assert.deepEqual(res.body, {
    displayName: 'Person', summary: 'Builder', field: '', skills: ['Node.js'], links: [],
  });
});

test('update stores only validated profile fields and returns the public profile', async () => {
  let query;
  let update;
  let options;
  const updatedUser = {
    username: 'Person',
    profile: { displayName: 'P. Person', skills: ['Node.js'], summary: '', field: '', links: [] },
  };
  restore.push(replace(User, 'findByIdAndUpdate', (...args) => {
    [query, update, options] = args;
    return { select: async (fields) => {
      assert.equal(fields, '_id username profile');
      return updatedUser;
    } };
  }));
  const res = createResponse();

  await controller.update({ user: { _id: 'user-1' }, body: { displayName: 'P. Person', skills: ['Node.js'] } }, res,
    (error) => { throw error; });

  assert.equal(query, 'user-1');
  assert.deepEqual(update, { $set: { 'profile.displayName': 'P. Person', 'profile.skills': ['Node.js'] } });
  assert.deepEqual(options, { new: true, runValidators: true });
  assert.deepEqual(res.body, {
    displayName: 'P. Person', summary: '', field: '', skills: ['Node.js'], links: [],
  });
});

test('update rejects invalid fields and does not access the database', async () => {
  let databaseCalled = false;
  restore.push(replace(User, 'findByIdAndUpdate', () => { databaseCalled = true; }));
  const res = createResponse();
  let forwardedError;

  await controller.update({ user: { _id: 'user-1' }, body: { email: 'new@example.com' } }, res,
    (error) => { forwardedError = error; });

  assert.equal(forwardedError.status, 400);
  assert.equal(databaseCalled, false);
});

test('update rejects empty patches and malformed links', async () => {
  const res = createResponse();
  let forwardedError;
  await controller.update({ user: { _id: 'user-1' }, body: {} }, res, (error) => { forwardedError = error; });
  assert.equal(forwardedError.status, 400);

  await controller.update({ user: { _id: 'user-1' }, body: { links: ['not a URL'] } }, res,
    (error) => { forwardedError = error; });
  assert.equal(forwardedError.status, 400);
});
