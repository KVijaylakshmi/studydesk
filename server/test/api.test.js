import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../app.js';

test('API health, protected task routes and malformed requests', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base + '/api/health')).status, 200);
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
      const path = ['PUT', 'DELETE'].includes(method) ? '/api/tasks/507f1f77bcf86cd799439011' : '/api/tasks';
      const response = await fetch(base + path, { method, headers: { Authorization: 'Bearer invalid' } });
      assert.equal(response.status, 401);
    }
    const response = await fetch(base + '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: '', email: 'invalid', password: 'short' }) });
    assert.equal(response.status, 400);
    assert.equal((await fetch(base + '/api/unknown')).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
