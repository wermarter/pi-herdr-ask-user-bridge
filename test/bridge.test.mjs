import test from 'node:test';
import assert from 'node:assert/strict';
import init from '../extensions/index.ts';

test('balances overlapping, duplicate and malformed waits, including shutdown', () => {
  const handlers = new Map();
  const hooks = new Map();
  const messages = [];
  init({ events: { on: (name, fn) => handlers.set(name, fn), emit: (name, data) => messages.push({ name, ...data }) }, on: (name, fn) => hooks.set(name, fn) });
  const send = handlers.get('rpiv:ask-user:blocked');
  send(null);
  send({ active: true });
  send({ active: true, toolCallId: 'a' });
  send({ active: true, toolCallId: 'a' });
  send({ active: true, toolCallId: 'b' });
  send({ active: false, toolCallId: 'a' });
  send({ active: false, toolCallId: 'a' });
  hooks.get('session_shutdown')();
  hooks.get('session_shutdown')();
  assert.deepEqual(messages.map(({ name, active }) => [name, active]), [
    ['herdr:blocked', true], ['herdr:blocked', true],
    ['herdr:blocked', false], ['herdr:blocked', false],
  ]);
  assert.equal(messages[0].label, 'Waiting for user answer');
});
