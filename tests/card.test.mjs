import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
const browser = new Window();
for (const key of [
  'window',
  'document',
  'customElements',
  'HTMLElement',
  'Element',
  'Document',
  'DocumentFragment',
  'ShadowRoot',
  'CSSStyleSheet',
  'CustomEvent',
  'Event',
  'Node',
])
  globalThis[key] = key === 'window' ? browser : browser[key];
await import('../dist/deye-battery-schedule-card.js');
after(() => browser.happyDOM.abort());
const programs = Array.from({ length: 6 }, (_, i) => ({ time: `time.p${i}`, soc: `number.p${i}` }));
const config = { type: 'custom:deye-battery-schedule-card', programs };
const times = ['01:00:00', '05:00:00', '09:00:00', '13:00:00', '17:00:00', '23:00:00'];
function hass(callService = async () => {}) {
  return {
    states: Object.fromEntries(
      programs.flatMap((p, i) => [
        [p.time, { state: times[i], attributes: {} }],
        [p.soc, { state: '50', attributes: { min: 10, max: 100, step: 1, unit_of_measurement: '%' } }],
      ]),
    ),
    callService,
  };
}
async function create(h = hass()) {
  const el = document.createElement('deye-battery-schedule-card');
  el.setConfig(config);
  el.hass = h;
  document.body.append(el);
  await el.updateComplete;
  return el;
}
async function flush(el) {
  await Promise.resolve();
  await el.updateComplete;
  await el.updateComplete;
}
async function edit(el, row, field, value) {
  el.shadowRoot.querySelectorAll(field === 'time' ? '.interval' : '.soc')[row].click();
  await flush(el);
  const input = el.shadowRoot.querySelector('#value');
  assert.ok(input);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  el.shadowRoot.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
  await flush(el);
}

test('six intervals derive from real entities, last wraps to first, neighbors update', async () => {
  const el = await create();
  assert.deepEqual(
    el.views.map((v) => [v.start, v.end]),
    times.map((t, i) => [t, times[(i + 1) % 6]]),
  );
  assert.equal(el.views[5].nextDay, true);
  const next = hass();
  next.states['time.p1'].state = '06:30:00';
  el.hass = next;
  await flush(el);
  assert.equal(el.views[0].end, '06:30:00');
  assert.equal(el.views[1].start, '06:30:00');
  assert.equal(el.views[1].end, '09:00:00');
  el.remove();
});
test('configuration validation, domain isolation and duplicate IDs', async () => {
  const el = await create();
  assert.throws(() => el.setConfig({ programs: [] }), /6/);
  assert.throws(() => el.setConfig({ ...config, title: 3 }), /рядком/);
  assert.throws(() => el.setConfig({ ...config, programs: programs.map(() => programs[0]) }), /повторюватися/);
  el.setConfig({ ...config, programs: programs.map((p, i) => (i === 2 ? { ...p, time: 'sensor.invalid' } : p)) });
  await flush(el);
  assert.ok(el.views[2].issue);
  assert.equal(el.views[3].issue, '');
  el.remove();
});
test('SOC service targets only selected entity and waits beyond promise resolution', async () => {
  const calls = [];
  const el = await create(
    hass(async (...args) => {
      calls.push(args);
    }),
  );
  await edit(el, 3, 'soc', '65');
  assert.deepEqual(calls, [['number', 'set_value', { entity_id: 'number.p3', value: 65 }]]);
  assert.equal(el.views[3].soc, 50);
  assert.equal(el.commands.pending.has(3), true);
  el.shadowRoot.querySelectorAll('.soc')[3].click();
  await flush(el);
  assert.equal(el.draft, undefined);
  const next = hass();
  next.states['number.p3'].state = '65.0';
  el.hass = next;
  await flush(el);
  assert.equal(el.commands.pending.size, 0);
  assert.equal(el.views[3].soc, 65);
  el.remove();
});
test('time service uses HH:MM:SS and updates intervals only after confirmation', async () => {
  const calls = [];
  const el = await create(hass(async (...args) => calls.push(args)));
  await edit(el, 1, 'time', '06:30');
  assert.deepEqual(calls, [['time', 'set_value', { entity_id: 'time.p1', time: '06:30:00' }]]);
  assert.equal(el.views[0].end, '05:00:00');
  const next = hass();
  next.states['time.p1'].state = '06:30';
  el.hass = next;
  await flush(el);
  assert.equal(el.commands.pending.size, 0);
  assert.equal(el.views[0].end, '06:30:00');
  el.remove();
});
test('independent programs can be pending; duplicate commands blocked per row', async () => {
  const calls = [];
  const el = await create(hass(async (...args) => calls.push(args)));
  await edit(el, 0, 'soc', '51');
  await edit(el, 1, 'soc', '52');
  assert.equal(calls.length, 2);
  assert.equal(el.commands.pending.size, 2);
  el.commands.send(0, 'soc', 'number.p0', 90, el.hass);
  assert.equal(calls.length, 2);
  el.remove();
});
test('15 second timeout, retry and stale promise rejection isolation', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let reject;
  const el = await create(hass(() => new Promise((_, fail) => (reject = fail))));
  await edit(el, 0, 'soc', '55');
  t.mock.timers.tick(15001);
  await flush(el);
  assert.equal(el.commands.pending.size, 0);
  assert.match(el.commands.errors.get(0), /підтвердження/);
  el.setConfig(config);
  el.hass = hass();
  reject(Error('late'));
  await flush(el);
  assert.equal(el.commands.errors.size, 0);
  el.remove();
  t.mock.timers.reset();
});
test('service failures and synchronous throws clear pending', async () => {
  for (const service of [
    async () => {
      throw Error('secret');
    },
    () => {
      throw Error('secret');
    },
  ]) {
    const el = await create(hass(service));
    await edit(el, 0, 'soc', '55');
    assert.equal(el.commands.pending.size, 0);
    assert.match(el.commands.errors.get(0), /Не вдалося/);
    assert.doesNotMatch(el.shadowRoot.querySelector('.feedback').textContent, /secret/);
    el.remove();
  }
});
test('unavailable program isolated, missing next time never fabricated', async () => {
  const h = hass();
  h.states['time.p2'].state = 'unavailable';
  const el = await create(h);
  assert.equal(el.views[2].issue, 'Немає зв’язку');
  assert.equal(el.views[1].end, undefined);
  assert.equal(el.views[1].issue, '');
  assert.equal(el.views[3].issue, '');
  assert.equal(el.shadowRoot.querySelectorAll('.soc')[2].disabled, true);
  await edit(el, 3, 'soc', '51');
  assert.equal(el.commands.pending.has(3), true);
  el.remove();
});
test('invalid time and numeric state, number limits, step and unchanged drafts', async () => {
  let calls = 0;
  const h = hass(async () => {
    calls++;
  });
  h.states['number.p0'].attributes = { min: 20, max: 90, step: 5 };
  const el = await create(h);
  for (const value of ['19', '91', '53', '']) {
    await edit(el, 0, 'soc', value);
    assert.ok(el.draft.error);
    el.closeEditor();
    await flush(el);
  }
  assert.equal(calls, 0);
  await edit(el, 0, 'soc', '50');
  assert.equal(calls, 0);
  assert.equal(el.draft, undefined);
  const next = hass();
  next.states['time.p1'].state = '24:30:00';
  next.states['number.p2'].state = 'NaN';
  el.hass = next;
  await flush(el);
  assert.ok(el.views[1].issue);
  assert.ok(el.views[2].issue);
  el.remove();
});
test('draft conflict and entity outage block writing stale values', async () => {
  let calls = 0;
  const el = await create(
    hass(async () => {
      calls++;
    }),
  );
  el.shadowRoot.querySelector('.soc').click();
  await flush(el);
  const next = hass();
  next.states['number.p0'].state = '60';
  el.hass = next;
  await flush(el);
  el.shadowRoot.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
  await flush(el);
  assert.match(el.draft.error, /вже змінилося/);
  assert.equal(calls, 0);
  el.remove();
});
test('live entity disconnect ends pending and late service failure cannot overwrite confirmation', async () => {
  let reject;
  const el = await create(hass(() => new Promise((_, fail) => (reject = fail))));
  await edit(el, 0, 'soc', '55');
  const next = hass();
  next.states['number.p0'].state = '55';
  el.hass = next;
  await flush(el);
  reject(Error('late'));
  await flush(el);
  assert.equal(el.commands.errors.size, 0);
  el.hass = hass();
  await flush(el);
  await edit(el, 0, 'soc', '55');
  el.hass = { ...hass(), states: {} };
  await flush(el);
  assert.equal(el.commands.pending.size, 0);
  assert.match(el.commands.errors.get(0), /зв’язку/);
  el.remove();
});
test('disconnect/reconfigure clears timers, drafts and pending callbacks', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const el = await create();
  await edit(el, 0, 'soc', '55');
  el.remove();
  assert.equal(el.commands.pending.size, 0);
  assert.equal(el.draft, undefined);
  t.mock.timers.tick(15001);
  assert.equal(el.commands.errors.size, 0);
  document.body.append(el);
  await flush(el);
  assert.equal(el.shadowRoot.querySelector('li').getAttribute('aria-busy'), 'false');
  el.remove();
  t.mock.timers.reset();
});
test('picker, six blank stub pairs, Sections sizing, editor entity filters and config events', async () => {
  const el = await create();
  assert.equal(el.getGridOptions().columns, 'full');
  assert.equal(el.getGridOptions().rows, 'auto');
  assert.equal(el.getCardSize(), 7);
  assert.equal(el.shadowRoot.querySelectorAll('ha-card').length, 1);
  const C = el.constructor;
  assert.equal(C.getStubConfig().programs.length, 6);
  assert.ok(C.getStubConfig().programs.every((p) => p.time === '' && p.soc === ''));
  assert.equal(window.customCards[0].type, 'deye-battery-schedule-card');
  const editor = C.getConfigElement();
  editor.setConfig(config);
  editor.hass = hass();
  document.body.append(editor);
  await editor.updateComplete;
  assert.equal(editor.shadowRoot.querySelectorAll('select').length, 12);
  assert.equal(editor.shadowRoot.querySelector('select').options.length, 7);
  let changed;
  editor.addEventListener('config-changed', (event) => (changed = event.detail.config));
  const input = editor.shadowRoot.querySelector('input');
  input.value = 'Батарея';
  input.dispatchEvent(new Event('input'));
  assert.equal(changed.title, 'Батарея');
  assert.equal(changed.programs.length, 6);
  editor.remove();
  el.remove();
});

test('fractional SOC steps retain the entity anchor and nonzero time seconds are preserved', async () => {
  const calls = [];
  const h = hass(async (...args) => calls.push(args));
  h.states['number.p0'].attributes = { min: -0.1, max: 100, step: 0.25 };
  h.states['number.p0'].state = '49.9';
  h.states['time.p1'].state = '05:00:30';
  const el = await create(h);
  assert.equal(el.views[0].limits.min, 0.15);
  assert.equal(el.views[0].limits.max, 99.9);
  await edit(el, 0, 'soc', '50.15');
  assert.equal(calls[0][2].value, 50.15);
  await edit(el, 1, 'time', '06:30:45');
  assert.equal(calls[1][2].time, '06:30:45');
  el.remove();
});
