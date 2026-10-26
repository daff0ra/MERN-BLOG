const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const Article = require('../src/models/Article');
const controller = require('../src/controllers/articleController');
const { createResponse, replace } = require('./helpers');

const restore = [];
afterEach(() => { while (restore.length) restore.pop()(); });

test('create makes a private draft owned by the authenticated user', async () => {
  restore.push(replace(Article, 'create', async (data) => data));
  const res = createResponse();
  await controller.create({
    user: { _id: 'owner-1' },
    body: { title: 'A useful project', content: 'What I learned.' },
  }, res, (error) => { throw error; });

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.owner, 'owner-1');
  assert.equal(res.body.status, 'draft');
  assert.deepEqual(res.body.topics, []);
  assert.equal(res.body.summary, '');
});

test('create rejects unsupported publication or ownership fields', async () => {
  let databaseCalled = false;
  restore.push(replace(Article, 'create', async () => { databaseCalled = true; }));
  let forwardedError;
  await controller.create({
    user: { _id: 'owner-1' },
    body: { title: 'A useful project', content: 'Details', owner: 'other', status: 'published' },
  }, createResponse(), (error) => { forwardedError = error; });

  assert.equal(forwardedError.status, 400);
  assert.equal(databaseCalled, false);
});

test('get scopes article lookup to its owner and hides another user article', async () => {
  let query;
  restore.push(replace(Article, 'findOne', (filter) => {
    query = filter;
    return { select: () => ({ lean: async () => null }) };
  }));
  const res = createResponse();
  await controller.get({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' } }, res,
    (error) => { throw error; });

  assert.deepEqual(query, { _id: '507f1f77bcf86cd799439011', owner: 'owner-1' });
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: 'Article not found.' });
});

test('update scopes mutation to its owner and rejects an empty patch', async () => {
  let query;
  restore.push(replace(Article, 'findOneAndUpdate', (filter) => {
    query = filter;
    return { select: () => ({ lean: async () => null }) };
  }));
  let forwardedError;
  await controller.update({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' }, body: {} },
    createResponse(), (error) => { forwardedError = error; });
  assert.equal(forwardedError.status, 400);

  const res = createResponse();
  await controller.update({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' }, body: { title: 'Revised title' } },
    res, (error) => { throw error; });
  assert.deepEqual(query, { _id: '507f1f77bcf86cd799439011', owner: 'owner-1' });
  assert.equal(res.statusCode, 404);
});

test('delete uses owner scope and returns no content for an owned draft', async () => {
  let query;
  restore.push(replace(Article, 'findOneAndDelete', async (filter) => {
    query = filter;
    return { _id: filter._id, owner: filter.owner };
  }));
  const res = createResponse();
  await controller.remove({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' } }, res,
    (error) => { throw error; });

  assert.deepEqual(query, { _id: '507f1f77bcf86cd799439011', owner: 'owner-1' });
  assert.equal(res.statusCode, 204);
  assert.equal(res.ended, true);
});

test('preview requires owner-scoped lookup and marks the response as preview', async () => {
  let query;
  const draft = { _id: '507f1f77bcf86cd799439011', owner: 'owner-1', title: 'Draft', content: 'Text' };
  restore.push(replace(Article, 'findOne', (filter) => {
    query = filter;
    return { select: () => ({ lean: async () => draft }) };
  }));
  const res = createResponse();
  await controller.preview({ params: { id: draft._id }, user: { _id: 'owner-1' } }, res, (error) => { throw error; });

  assert.deepEqual(query, { _id: draft._id, owner: 'owner-1' });
  assert.equal(res.body.preview, true);
  assert.equal(res.body.content, 'Text');
});

test('publish creates a hard-to-guess share slug and scopes the update to its owner', async () => {
  let query;
  let update;
  const published = { status: 'published', visibility: 'unlisted', shareSlug: 'random-secret' };
  restore.push(replace(Article, 'findOneAndUpdate', (filter, updates) => {
    query = filter;
    update = updates;
    return { select: async (fields) => {
      assert.equal(fields, '+shareSlug');
      return published;
    } };
  }));
  const res = createResponse();
  await controller.publish({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' }, body: { visibility: 'unlisted' } }, res,
    (error) => { throw error; });

  assert.deepEqual(query, { _id: '507f1f77bcf86cd799439011', owner: 'owner-1' });
  assert.equal(update.$set.status, 'published');
  assert.equal(update.$set.visibility, 'unlisted');
  assert.equal(update.$set.shareSlug.length, 32);
  assert.equal(res.body.shareSlug, 'random-secret');
});

test('publish rejects invalid visibility without changing the article', async () => {
  let databaseCalled = false;
  restore.push(replace(Article, 'findOneAndUpdate', async () => { databaseCalled = true; }));
  let forwardedError;
  await controller.publish({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' }, body: { visibility: 'secret' } },
    createResponse(), (error) => { forwardedError = error; });
  assert.equal(forwardedError.status, 400);
  assert.equal(databaseCalled, false);
});

test('unpublish resets privacy and removes the share slug', async () => {
  let query;
  let update;
  restore.push(replace(Article, 'findOneAndUpdate', async (filter, updates) => {
    query = filter;
    update = updates;
    return { status: 'draft', visibility: 'private' };
  }));
  const res = createResponse();
  await controller.unpublish({ params: { id: '507f1f77bcf86cd799439011' }, user: { _id: 'owner-1' } }, res,
    (error) => { throw error; });

  assert.deepEqual(query, { _id: '507f1f77bcf86cd799439011', owner: 'owner-1' });
  assert.deepEqual(update.$set, { status: 'draft', visibility: 'private' });
  assert.deepEqual(update.$unset, { shareSlug: 1 });
});

test('public reader only receives the allowlisted article and author fields', async () => {
  let query;
  const publicArticle = {
    title: 'Public title', content: 'Public copy', summary: 'Short', topics: ['Node'], updatedAt: new Date(),
    _id: 'private-id', shareSlug: 'secret-token', owner: { email: 'hidden@example.com', username: 'Person', profile: { displayName: 'P. Person' } },
  };
  restore.push(replace(Article, 'findOne', (filter) => {
    query = filter;
    return { populate: () => ({ lean: async () => publicArticle }) };
  }));
  const res = createResponse();
  await controller.readPublic({ params: { slug: 'secret-token' } }, res, (error) => { throw error; });

  assert.deepEqual(query, {
    shareSlug: 'secret-token', status: 'published', visibility: { $in: ['unlisted', 'public'] },
  });
  assert.equal(res.body.author, 'P. Person');
  assert.equal(res.body.title, 'Public title');
  assert.equal('owner' in res.body, false);
  assert.equal('shareSlug' in res.body, false);
  assert.equal('email' in res.body, false);
});
