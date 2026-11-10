import { chromium, type Browser, type Page } from 'playwright';
import {
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
} from 'vitest';
import { readFileSync } from 'node:fs';
import { createFixtureServer, type FixtureServer } from './fixture-server.js';
import type { Har } from '../src/har.js';

const har: Har = JSON.parse(
  readFileSync(new URL('../public/demo.har', import.meta.url), 'utf8'),
);
// Exercise duplicate names and HTML-sensitive values through SSR and the DOM.
har.log.entries[0]!.request.headers.push({
  name: 'x-test',
  value: '<img src=x onerror="window.headerInjected=true"> & "quoted"',
});
har.log.entries[0]!.response.headers.push(
  { name: 'set-cookie', value: 'first=1; Path=/' },
  { name: 'set-cookie', value: 'second=2; Path=/' },
);
let browser: Browser;
let server: FixtureServer;

beforeAll(async () => {
  browser = await chromium.launch();
  server = await createFixtureServer({ har });
});
afterAll(async () => {
  await browser.close();
  await server.close();
});

for (const mode of ['progressive', 'interactive']) {
  describe(`${mode} resource details`, () => {
    let page: Page;
    beforeEach(async () => {
      page = await browser.newPage();
      await page.goto(`${server.url}/${mode}`);
      await page.waitForFunction(() => !!customElements.get('waterfall-chart'));
      if (mode === 'interactive') {
        await page.evaluate((data) => {
          (
            document.querySelector('waterfall-chart') as HTMLElement & {
              har: Har;
            }
          ).har = data;
        }, har);
      }
      await page.waitForSelector('.wf-expand');
    });
    afterEach(async () => {
      await page.close();
    });

    it('preserves actual request and response headers in both detail views', async () => {
      const row = page.locator('.wf-row').first();
      await row.locator('.wf-expand').click();
      await row.locator('.wf-open-drawer').click();
      for (const panel of [
        row.locator('.wf-panel'),
        page.locator('.wf-drawer .wf-panel'),
      ]) {
        const tables = panel.locator('.wf-headers-table');
        for (const [index, headers] of [
          har.log.entries[0]!.request.headers,
          har.log.entries[0]!.response.headers,
        ].entries()) {
          const actual = await tables
            .nth(index)
            .locator('tr')
            .evaluateAll((rows) =>
              rows.map((row) =>
                Array.from(
                  row.querySelectorAll('td:not(.wf-header-action)'),
                  (cell) => cell.textContent,
                ),
              ),
            );
          expect(actual).toEqual(
            headers.map((header) => [header.name, header.value]),
          );
        }
        expect(await panel.locator('img').count()).toBe(0);
      }
      expect(await page.evaluate(() => 'headerInjected' in window)).toBe(false);
    });

    it('copies individual headers exactly in both views, including duplicate names', async () => {
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (text: string) => {
              (window as unknown as { copied: string }).copied = text;
            },
          },
        });
      });
      const row = page.locator('.wf-row').first();
      await row.locator('.wf-expand').click();
      for (const view of ['inline', 'drawer']) {
        if (view === 'drawer') await row.locator('.wf-open-drawer').click();
        const panel =
          view === 'inline'
            ? row.locator('.wf-panel')
            : page.locator('.wf-drawer .wf-panel');
        for (const [index, headers] of [
          har.log.entries[0]!.request.headers,
          har.log.entries[0]!.response.headers,
        ].entries()) {
          for (const [headerIndex, header] of headers.entries()) {
            const button = panel
              .locator('.wf-headers-table')
              .nth(index)
              .locator('.wf-copy-header')
              .nth(headerIndex);
            await button.focus();
            await page.keyboard.press('Enter');
            await page.waitForFunction(
              (expected) =>
                (window as unknown as { copied: string }).copied === expected,
              `${header.name}: ${header.value}`,
            );
            expect(await button.getAttribute('data-copy-state')).toBe('copied');
            expect(await panel.locator('[role="status"]').textContent()).toBe(
              `Copied header ${header.name}.`,
            );
          }
        }
        expect(
          await row.locator('.wf-expand').getAttribute('aria-expanded'),
        ).toBe('true');
      }
      const drawer = page.getByRole('dialog');
      await drawer.locator('.wf-panel-close').focus();
      await page.keyboard.press('Tab');
      expect(
        await drawer
          .locator('.wf-copy-header')
          .first()
          .evaluate((el) => el === document.activeElement),
      ).toBe(true);
      await drawer.locator('.wf-copy-header').last().focus();
      await page.keyboard.press('Tab');
      expect(
        await drawer
          .locator('.wf-panel-close')
          .evaluate((el) => el === document.activeElement),
      ).toBe(true);
      await page.keyboard.press('Shift+Tab');
      expect(
        await drawer
          .locator('.wf-copy-header')
          .last()
          .evaluate((el) => el === document.activeElement),
      ).toBe(true);
    });

    it('reports clipboard failure and allows retry', async () => {
      await page.evaluate(() => {
        let calls = 0;
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async () => {
              if (++calls === 1) throw new Error('Permission denied');
            },
          },
        });
      });
      await page.locator('.wf-expand').first().click();
      const panel = page.locator('.wf-panel');
      const copy = panel.locator('.wf-copy-header').first();
      await copy.click();
      expect(await copy.getAttribute('data-copy-state')).toBe('error');
      expect(await panel.locator('[role="status"]').textContent()).toContain(
        'Could not copy',
      );
      await copy.click();
      expect(await copy.getAttribute('data-copy-state')).toBe('copied');
    });

    it('expands in place with Enter and collapses with Space, keeping native list semantics', async () => {
      const row = page.locator('.wf-row').first();
      const expand = row.locator('.wf-expand');
      expect(await row.getAttribute('role')).toBeNull();
      expect(await expand.getAttribute('aria-expanded')).toBe('false');
      const nextBefore = (await page.locator('.wf-row').nth(1).boundingBox())!
        .y;
      await expand.focus();
      await page.keyboard.press('Enter');
      expect(await expand.getAttribute('aria-expanded')).toBe('true');
      expect(await row.locator('.wf-panel').count()).toBe(1);
      expect(await row.locator('.wf-panel').getAttribute('id')).toBe(
        await expand.getAttribute('aria-controls'),
      );
      expect(
        (await page.locator('.wf-row').nth(1).boundingBox())!.y,
      ).toBeGreaterThan(nextBefore);
      await page.waitForFunction(() => {
        const wrap = document.querySelector<HTMLElement>('.wf-list-wrap')!;
        return (
          parseInt(wrap.style.getPropertyValue('--wf-overlay-h')) ===
          wrap.offsetHeight
        );
      });
      await row.locator('.wf-section-title').first().click();
      expect(await row.locator('.wf-panel').count()).toBe(1);
      await expand.focus();
      const scrollY = await page.evaluate(() => window.scrollY);
      await page.keyboard.press(' ');
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      expect(await expand.getAttribute('aria-expanded')).toBe('false');
      expect(await row.locator('.wf-panel').count()).toBe(0);
    });

    it('closes inline details with correct state and restores focus', async () => {
      const row = page.locator('.wf-row').first();
      await row.locator('.wf-expand').click();
      await row.getByRole('button', { name: 'Close details' }).click();
      expect(
        await row.locator('.wf-expand').getAttribute('aria-expanded'),
      ).toBe('false');
      expect(
        await row
          .locator('.wf-expand')
          .evaluate((el) => el === document.activeElement),
      ).toBe(true);
    });

    it('shows the same details in a right drawer without expanding the row and restores focus on Escape', async () => {
      const row = page.locator('.wf-row').first();
      await row.locator('.wf-expand').click();
      const inlineData = await row.locator('.wf-panel-body').innerText();
      await row.locator('.wf-expand').click();
      const trigger = row.locator('.wf-open-drawer');
      await trigger.focus();
      await page.keyboard.press('Enter');
      const drawer = page.getByRole('dialog');
      expect(await drawer.locator('.wf-panel-body').innerText()).toBe(
        inlineData,
      );
      expect(
        await row.locator('.wf-expand').getAttribute('aria-expanded'),
      ).toBe('false');
      const bounds = (await drawer.boundingBox())!;
      expect(bounds.x + bounds.width).toBe(page.viewportSize()!.width);
      expect(bounds.y).toBe(0);
      await page.keyboard.press('Tab');
      expect(
        await drawer.evaluate((el) => el.contains(document.activeElement)),
      ).toBe(true);
      await page.keyboard.press('Escape');
      expect(await page.locator('.wf-drawer').count()).toBe(0);
      expect(
        await trigger.evaluate((el) => el === document.activeElement),
      ).toBe(true);
    });

    it('keeps inline details expanded when closing their drawer', async () => {
      const row = page.locator('.wf-row').first();
      await row.locator('.wf-expand').click();
      await row.locator('.wf-open-drawer').click();
      await page
        .getByRole('dialog')
        .getByRole('button', { name: 'Close details' })
        .click();
      expect(await row.locator('.wf-panel').count()).toBe(1);
      expect(
        await row.locator('.wf-expand').getAttribute('aria-expanded'),
      ).toBe('true');
      await row.locator('.wf-expand').click();
    });

    it('fits the drawer in a narrow viewport and dismisses by clicking the backdrop', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.locator('.wf-open-drawer').first().click();
      const drawer = page.getByRole('dialog');
      expect((await drawer.boundingBox())!.width).toBeLessThanOrEqual(375);
      expect(
        await drawer.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      await page.keyboard.press('Escape');
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.locator('.wf-open-drawer').first().click();
      await page.mouse.click(10, 300);
      expect(await page.locator('.wf-drawer').count()).toBe(0);
    });

    it('hides expanded details with their filtered resource and clears details on data replacement', async () => {
      const row = page.locator('.wf-row').first();
      await row.locator('.wf-expand').click();
      await page
        .locator('.wf-filters')
        .getByRole('button', { name: 'JS', exact: true })
        .click();
      expect(await row.isVisible()).toBe(false);
      expect(await row.locator('.wf-panel').isVisible()).toBe(false);
      await page
        .locator('.wf-filters')
        .getByRole('button', { name: 'all', exact: true })
        .click();
      expect(await row.locator('.wf-panel').isVisible()).toBe(true);
      await row.locator('.wf-open-drawer').click();
      await page.evaluate((data) => {
        (
          document.querySelector('waterfall-chart') as HTMLElement & {
            har: Har;
          }
        ).har = data;
      }, har);
      expect(await page.locator('.wf-panel, .wf-drawer').count()).toBe(0);
      expect(
        await page.locator('.wf-expand[aria-expanded="true"]').count(),
      ).toBe(0);
    });
  });
}
