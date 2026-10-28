import test from 'node:test';
import assert from 'node:assert/strict';
import { taskInput } from '../validation.js';
const valid = { title: '  Revise React  ', subject: 'Web Development', dueDate: '2026-10-17' };
test('trims input, supplies defaults, and ignores user ownership from requests', () => {
  const result = taskInput({ ...valid, user: 'someone-else' });
  assert.equal(result.title, 'Revise React');
  assert.equal(result.status, 'To do');
  assert.equal(result.priority, 'Medium');
  assert.equal(result.user, undefined);
});
test('rejects empty fields, impossible dates, and invalid enum values', () => {
  for (const fields of [{ title: ' ' }, { subject: '' }, { dueDate: '2026-02-30' }, { priority: 'Urgent' }, { status: 'Unknown' }, { description: 'x'.repeat(1001) }]) {
    assert.throws(() => taskInput({ ...valid, ...fields }));
  }
});
