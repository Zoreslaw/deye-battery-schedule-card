import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const card = (page) => page.locator('deye-battery-schedule-card').first();
const normal = '/examples/preview.html?scenario=normal&theme=light';

test('keyboard dialog, pending truth, exact entity target, confirmation and focus restoration', async ({ page }) => {
  await page.goto(normal);
  const c = card(page);
  const soc = c.locator('.soc').nth(1);
  await soc.focus();
  await page.keyboard.press('Enter');
  await expect(c.locator('dialog')).toBeVisible();
  await expect(c.locator('#value')).toBeFocused();
  await c.getByRole('button', { name: 'Збільшити заряд' }).click();
  await expect(c.locator('#value')).toHaveValue('51');
  await c.getByRole('button', { name: 'Зберегти' }).click();
  await expect(c.locator('li').nth(1)).toHaveAttribute('aria-busy', 'true');
  await expect(soc).toContainText('50');
  await expect(soc).toBeFocused();
  expect(await page.evaluate(() => window.previewCalls[0])).toEqual({
    domain: 'number',
    service: 'set_value',
    data: { entity_id: 'number.demo_program_2', value: 51 },
  });
  await expect(soc).toContainText('51');
  await expect(c.locator('li').nth(1)).toHaveAttribute('aria-busy', 'false');
  await soc.press('Space');
  await expect(c.locator('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(c.locator('dialog')).not.toBeVisible();
  await expect(soc).toBeFocused();
});
test('time editing updates both neighbors; dialog keeps focus inside', async ({ page }) => {
  await page.goto(normal);
  const c = card(page);
  await c.locator('.interval').nth(1).click();
  await c.getByRole('spinbutton', { name: 'Години', exact: true }).fill('06');
  await c.getByRole('spinbutton', { name: 'Хвилини', exact: true }).fill('30');
  await c.getByRole('button', { name: 'Зберегти' }).click();
  await expect(c.locator('.interval').first()).toContainText('05:00');
  await expect(c.locator('.interval').first()).toContainText('06:30');
  await expect(c.locator('.interval').nth(1)).toContainText('06:30');
  await c.locator('.soc').first().click();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    expect(await c.locator('dialog').evaluate((el) => el.contains(el.getRootNode().activeElement))).toBe(true);
  }
});
test('touch tap edits SOC, scrolling does not open a dialog', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 650 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5001' + normal);
  const c = card(page);
  const box = await c.locator('.interval').first().boundingBox();
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: box.x + 60, y: box.y + 20 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: box.x + 60, y: box.y - 60 }],
  });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(c.locator('dialog')).not.toBeVisible();
  await c.locator('.soc').first().tap();
  await expect(c.locator('dialog')).toBeVisible();
  await c.getByRole('button', { name: 'Збільшити заряд' }).tap();
  await c.getByRole('button', { name: 'Зберегти' }).tap();
  await expect(c.locator('.soc').first()).toContainText('51');
  await context.close();
});
test('all states, themes and viewports render without overflow or errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  fs.mkdirSync('previews', { recursive: true });
  for (const [size, width] of [
    ['mobile', 320],
    ['desktop', 1440],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark']) {
      await page.goto(`/examples/preview.html?theme=${theme}`);
      await expect(page.locator('deye-battery-schedule-card')).toHaveCount(6);
      await expect(card(page).locator('h2')).toHaveText('Розклад батареї');
      await expect(card(page).locator('ol > li')).toHaveCount(6);
      await expect(page.locator('[data-scenario=error] .feedback')).toContainText('Не вдалося');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const c of await page.locator('deye-battery-schedule-card').all())
        expect(await c.evaluate((el) => el.shadowRoot.querySelector('ha-card').scrollWidth <= el.clientWidth + 1)).toBe(
          true,
        );
      await page.screenshot({ path: `previews/${theme}-${size}.png`, fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});
test('status transitions do not shift rows, unavailable row isolated, reduced motion static', async ({ page }) => {
  await page.goto('/examples/preview.html?scenario=error&theme=dark');
  const c = card(page);
  const before = await c.locator('li').first().boundingBox();
  await c.locator('.soc').first().click();
  await c.locator('#value').fill('60');
  await c.getByRole('button', { name: 'Зберегти' }).click();
  await expect(c.locator('.feedback')).toContainText('Не вдалося');
  expect((await c.locator('li').first().boundingBox()).y).toBe(before.y);
  await page.goto('/examples/preview.html?scenario=unavailable&theme=light');
  await expect(card(page).locator('.soc').nth(2)).toBeDisabled();
  await expect(card(page).locator('.soc').nth(3)).toBeEnabled();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/preview.html?scenario=pending&theme=dark');
  await expect(card(page).locator('.spinner')).toBeVisible();
  expect(
    await card(page)
      .locator('.spinner')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});
test('visual editor selects six pairs without losing card type', async ({ page }) => {
  await page.goto(normal);
  await expect(card(page)).toHaveCount(1);
  await page.evaluate(() => {
    const c = window.previewCards[0];
    const ed = c.constructor.getConfigElement();
    ed.hass = c.hass;
    ed.setConfig(c.constructor.getStubConfig());
    document.body.append(ed);
    window.editorChanges = [];
    ed.addEventListener('config-changed', (e) => window.editorChanges.push(e.detail.config));
  });
  const editor = page.locator('deye-battery-schedule-card-editor');
  await expect(editor.locator('select')).toHaveCount(12);
  await editor.locator('select[data-row="0"][data-field=time]').selectOption('time.demo_program_1');
  const changed = await page.evaluate(() => window.editorChanges.at(-1));
  expect(changed.programs[0].time).toBe('time.demo_program_1');
  expect(changed.type).toBe('custom:deye-battery-schedule-card');
});

test('invalid values show Ukrainian feedback without sending an action', async ({ page }) => {
  await page.goto(normal);
  const c = card(page);
  await c.locator('.soc').first().click();
  await c.locator('#value').fill('101');
  await c.getByRole('button', { name: 'Зберегти' }).click();
  await expect(c.locator('.dialog-error')).toContainText('Вкажіть заряд');
  expect(await page.evaluate(() => window.previewCalls.length)).toBe(0);
  await page.keyboard.press('Escape');
});

test('inline time picker increments immediately, wraps midnight and saves the latest click', async ({ page }) => {
  await page.goto(normal);
  const c = card(page);
  await c.locator('.interval').first().click();
  const hours = c.getByRole('spinbutton', { name: 'Години', exact: true });
  const minutes = c.getByRole('spinbutton', { name: 'Хвилини', exact: true });
  await expect(hours).toBeFocused();
  await hours.fill('23');
  await minutes.fill('59');
  await c.getByRole('button', { name: 'Збільшити: хвилини', exact: true }).click();
  await expect(hours).toHaveValue('00');
  await expect(minutes).toHaveValue('00');
  await c.getByRole('button', { name: 'Збільшити: хвилини', exact: true }).press('Space');
  await expect(minutes).toHaveValue('01');
  await c.getByRole('button', { name: 'Зберегти' }).click();
  expect(await page.evaluate(() => window.previewCalls[0])).toEqual({
    domain: 'time',
    service: 'set_value',
    data: { entity_id: 'time.demo_program_1', time: '00:01:00' },
  });
});

test('inline time picker preserves seconds, keyboard focus and cleanup on reopen', async ({ page }) => {
  await page.goto(normal);
  await expect(card(page).locator('.interval').first()).toBeVisible();
  await page.evaluate(() => {
    const c = window.previewCards[0];
    c.hass = {
      ...c.hass,
      states: {
        ...c.hass.states,
        'time.demo_program_1': { ...c.hass.states['time.demo_program_1'], state: '01:00:15' },
      },
    };
  });
  const c = card(page);
  await c.locator('.interval').first().click();
  await expect(c.getByRole('spinbutton', { name: 'Секунди', exact: true })).toHaveValue('15');
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press('Tab');
    expect(await c.locator('dialog').evaluate((el) => el.contains(el.getRootNode().activeElement))).toBe(true);
  }
  await c.locator('.flatpickr-minute').focus();
  await page.keyboard.press('Escape');
  await expect(c.locator('dialog')).not.toBeVisible();
  await expect(c.locator('.flatpickr-calendar')).toHaveCount(0);
  expect(await page.evaluate(() => window.previewCalls)).toEqual([]);
  await c.locator('.interval').first().click();
  await expect(c.locator('.flatpickr-calendar')).toHaveCount(1);
  await c.locator('.flatpickr-minute').fill('30');
  await c.locator('.flatpickr-minute').press('Enter');
  await expect(c.locator('dialog')).not.toBeVisible();
  expect(await page.evaluate(() => window.previewCalls[0].data.time)).toBe('01:30:15');
});

test('inline time picker fits narrow touch screens in both themes without native popup', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 650 } });
  const page = await context.newPage();
  for (const theme of ['light', 'dark']) {
    await page.goto(`http://localhost:5001/examples/preview.html?scenario=normal&theme=${theme}`);
    const c = card(page);
    await c.locator('.interval').first().tap();
    await expect(c.locator('input[type=time]')).toHaveCount(0);
    const dialog = c.locator('dialog');
    const before = await dialog.boundingBox();
    expect(await dialog.evaluate((el) => el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    await c.getByRole('button', { name: 'Збільшити: хвилини', exact: true }).tap();
    await expect(c.locator('.flatpickr-minute')).toHaveValue('01');
    expect(await dialog.boundingBox()).toEqual(before);
    await page.screenshot({ path: `test-results/time-picker-${theme}.png` });
    await c.getByRole('button', { name: 'Скасувати' }).tap();
  }
  await context.close();
});
