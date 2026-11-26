// Playwright verification for DataNusa. Serves app/ on a local port, loads
// the site in Chromium at desktop (1280x800) and phone (390x844) sizes,
// collects console errors and failed/external requests, clicks through every
// route and every control, and takes the four screenshots.
// Usage: node verify.mjs [--shots-only]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/hatch/workspace/makefun/verify-tools/node_modules/playwright-core');
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/hatch/workspace/makefun/best-national-statistics-site';
const PORT = 8124;
const errors = [];
const failedRequests = [];
const results = {};
const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}
function shotSize(name) {
  const shotPath = join(ROOT, 'screenshots', name);
  if (!existsSync(shotPath)) return 'MISSING';
  const bytes = statSync(shotPath).size;
  const kib = bytes / 1024;
  const verdict = bytes <= 262144 ? 'OK' : 'OVER 256 KiB!';
  return `${kib.toFixed(1)} KiB ${verdict}`;
}
function serve() {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['serve.ts', '--port', String(PORT)], { cwd: ROOT, stdio: 'pipe' });
    let out = '';
    proc.stdout.on('data', (d) => { out += d; if (out.includes(`:${PORT}`)) resolve(proc); });
    proc.stderr.on('data', (d) => { out += d; });
    setTimeout(() => reject(new Error(`serve did not start: ${out}`)), 8000);
  });
}

const server = await serve();
console.log(`serving on :${PORT}`);
const browser = await chromium.launch({
  executablePath: '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const shotsOnly = process.argv.includes('--shots-only');
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => failedRequests.push(`${req.url()} ${req.failure()?.errorText ?? ''}`));
  page.on('request', (req) => {
    if (!req.url().startsWith(`http://127.0.0.1:${PORT}`) && !req.url().startsWith('data:')) {
      failedRequests.push(`EXTERNAL REQUEST: ${req.url()}`);
    }
  });

  // --- desktop: every route renders, no empty main -------------------------
  const routes = ['', 'penduduk', 'ekonomi', 'harga', 'kerja', 'pendidikan', 'kesehatan', 'perdagangan', 'tabel', 'tentang'];
  for (const r of routes) {
    await page.goto(`http://127.0.0.1:${PORT}/#/${r}`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const text = (await page.locator('#app').innerText()).trim();
    const h1 = await page.locator('#app h1').innerText().catch(() => '');
    check(`route #/${r || '(home)'} renders`, text.length > 200, `h1="${h1}" chars=${text.length}`);
    const canvases = await page.locator('#app canvas').count();
    if (canvases) {
      const drawn = await page.evaluate(() => {
        const c = document.querySelector('#app canvas');
        if (!c) return false;
        const ctx = c.getContext('2d');
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        let nonBlank = 0;
        for (let i = 3; i < d.length; i += 401 * 4) if (d[i] > 0) nonBlank++;
        return nonBlank > 5;
      });
      check(`route #/${r || '(home)'} canvas draws`, drawn);
    }
  }

  if (!shotsOnly) {
    // --- controls ----------------------------------------------------------
    await page.goto(`http://127.0.0.1:${PORT}/#/`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    // v2 home: 10 KPI cards, each with a drawn sparkline
    const kpiCount = await page.locator('#kpi-grid .kpi').count();
    check('home has 10 KPI cards', kpiCount === 10, `kpis=${kpiCount}`);
    const sparkCount = await page.locator('#kpi-grid .kpi-spark').count();
    check('home has 10 sparkline canvases', sparkCount === 10, `sparks=${sparkCount}`);
    const sparkDrawn = await page.evaluate(() => {
      const c = document.querySelector('.kpi-spark');
      if (!c) return false;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 16) if (d[i] > 0) n++;
      return n > 3;
    });
    check('home sparkline draws', sparkDrawn);
    const homeText = await page.locator('#app').innerText();
    check('home today strip (kurs/beras/BBM 26 Nov)', homeText.includes('18.211') && homeText.includes('14.670') && homeText.includes('10.000'), homeText.slice(0, 120).replace(/\n/g, ' | '));
    check('home KPI values (ekspor/UMP/stunting)', homeText.includes('282,91') && homeText.includes('3,51') && homeText.includes('19,8%'));
    // top-10 provinces table sorts by IPM: DKI Jakarta first
    await page.click('#top10-table [data-sort="ipm"]');
    await page.waitForTimeout(200);
    const topFirst = await page.locator('#top10-table tbody tr').first().innerText();
    check('top10 sort by IPM (DKI Jakarta first, 85,05)', topFirst.includes('DKI Jakarta') && topFirst.includes('85,05'), topFirst.replace(/\n/g, ' | '));
    await page.click('#top10-table [data-sort="pop"]');
    await page.waitForTimeout(200);
    const topPop = await page.locator('#top10-table tbody tr').first().innerText();
    check('top10 sort by population (Jawa Barat first)', topPop.includes('Jawa Barat') && topPop.includes('51,16'), topPop.replace(/\n/g, ' | '));

    // header search finds an indicator
    await page.fill('#site-search', 'stunting');
    await page.waitForTimeout(200);
    const searchText = await page.locator('#search-results').innerText();
    check('header search "stunting"', searchText.includes('19,8%'), searchText.replace(/\n/g, ' | ').slice(0, 120));
    await page.locator('#search-results a').first().click();
    await page.waitForTimeout(400);
    check('search result navigates to kesehatan', page.url().includes('#/kesehatan'), page.url());

    // penduduk: tab switch + province search + pyramid
    await page.goto(`http://127.0.0.1:${PORT}/#/penduduk`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    await page.click('[data-tab="growth"]');
    await page.waitForTimeout(200);
    await page.fill('#prov-search', 'Jawa Timur');
    await page.waitForTimeout(200);
    const provText = await page.locator('#prov-table').innerText();
    check('province search "Jawa Timur"', provText.includes('42,35') && !provText.includes('Jawa Barat'), provText.replace(/\n/g, ' | ').slice(0, 120));
    const pyrDrawn = await page.evaluate(() => {
      const c = document.querySelector('#pyramid-chart');
      if (!c) return false;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 401 * 4) if (d[i] > 0) n++;
      return n > 5;
    });
    check('penduduk pyramid draws', pyrDrawn);
    const pyrText = await page.locator('#app').innerText();
    check('penduduk pyramid facts (143,55 / 101,9 / 69,0%)', pyrText.includes('143,55') && pyrText.includes('101,9') && pyrText.includes('69,0%'));

    // ekonomi: tab switch + sector chart + commodity tables
    await page.goto(`http://127.0.0.1:${PORT}/#/ekonomi`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    await page.click('[data-tab="growth"]');
    await page.waitForTimeout(200);
    check('ekonomi growth tab', (await page.locator('#app').innerText()).includes('Pertumbuhan'));
    const sectorDrawn = await page.evaluate(() => {
      const c = document.querySelector('#sector-chart');
      if (!c) return false;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 401 * 4) if (d[i] > 0) n++;
      return n > 5;
    });
    check('ekonomi sector chart draws', sectorDrawn);
    const econText = await page.locator('#app').innerText();
    check('ekonomi commodity tables (45,11 / 36,17 / 4.541,5)', econText.includes('45,11') && econText.includes('36,17') && econText.includes('4.541,5'));
    check('ekonomi commodity CSV button', (await page.locator('#commodity-csv').count()) === 1);

    // perdagangan: 2025 KPIs
    await page.goto(`http://127.0.0.1:${PORT}/#/perdagangan`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const tradeText = await page.locator('#app').innerText();
    check('perdagangan 2025 KPIs (282,91 / 41,05 / 68 bln)', tradeText.includes('282,91') && tradeText.includes('41,05') && tradeText.includes('68 bln'));

    // tabel: sort by inflation descending, year filter, column search
    await page.goto(`http://127.0.0.1:${PORT}/#/tabel`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    await page.click('[data-key="inflation"]');
    await page.waitForTimeout(200);
    const firstAsc = await page.locator('#master-table tbody tr').first().innerText();
    check('table sort by inflation ascending (2024 first, 1,57)', firstAsc.startsWith('2024'), firstAsc.replace(/\n/g, ' | '));
    await page.click('[data-key="inflation"]');
    await page.waitForTimeout(200);
    const firstRow = await page.locator('#master-table tbody tr').first().innerText();
    check('table sort by inflation descending (2022 first, 5,51)', firstRow.startsWith('2022'), firstRow.replace(/\n/g, ' | '));
    await page.selectOption('#table-year', '2025');
    await page.waitForTimeout(200);
    const rows2025 = await page.locator('#master-table tbody tr').count();
    check('table year filter 2025', rows2025 === 1, `rows=${rows2025}`);
    await page.selectOption('#table-year', 'all');
    await page.fill('#table-search', 'kemiskinan');
    await page.waitForTimeout(200);
    const visibleTh = await page.evaluate(() => [...document.querySelectorAll('#master-table thead th')].filter((th) => th.style.display !== 'none').length);
    check('table column search "kemiskinan"', visibleTh === 2, `visible cols=${visibleTh}`);

    // pendidikan: year selector for IPM components
    await page.goto(`http://127.0.0.1:${PORT}/#/pendidikan`, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    await page.selectOption('#ipm-year', '2024');
    await page.waitForTimeout(200);
    const ipmText = await page.locator('#ipm-body').innerText();
    check('IPM year selector 2024', ipmText.includes('74,15') && ipmText.includes('13,21'), ipmText.replace(/\n/g, ' | '));
  }

  // --- screenshots ---------------------------------------------------------
  mkdirSync(join(ROOT, 'screenshots'), { recursive: true });
  const shots = [
    { name: '1-beranda.jpg', url: 'http://127.0.0.1:PORT/#/', viewport: { width: 1280, height: 800 } },
    { name: '2-ekonomi.jpg', url: 'http://127.0.0.1:PORT/#/ekonomi', viewport: { width: 1280, height: 900 } },
    { name: '3-penduduk-phone.jpg', url: 'http://127.0.0.1:PORT/#/penduduk', viewport: { width: 390, height: 844 } },
    { name: '4-tabel.jpg', url: 'http://127.0.0.1:PORT/#/tabel', viewport: { width: 1280, height: 800 } },
  ];
  for (const shot of shots) {
    await page.setViewportSize(shot.viewport);
    await page.waitForTimeout(400); // let the previous page's debounced chart redraw fire before navigating
    await page.goto(shot.url.replace('PORT', String(PORT)), { waitUntil: 'load' });
    await page.waitForTimeout(1500); // let debounced chart redraws settle; 600ms raced them on the phone shot
    await page.screenshot({ path: join(ROOT, 'screenshots', shot.name), type: 'jpeg', quality: 82 });
    results[shot.name] = shotSize(shot.name);
    console.log(`shot ${shot.name}: ${results[shot.name]}`);
  }

  // --- phone: nav scrolls, KPI grid 2 cols, no horizontal overflow --------
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`http://127.0.0.1:${PORT}/#/`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('phone no horizontal overflow', overflow <= 1, `overflow=${overflow}px`);
  const phoneText = (await page.locator('#app').innerText()).trim();
  check('phone home renders', phoneText.length > 200 && phoneText.includes('284,44'), `chars=${phoneText.length}`);

  check('console errors', errors.length === 0, errors.slice(0, 3).join(' || ') || 'none');
  check('failed/external requests', failedRequests.length === 0, failedRequests.slice(0, 3).join(' || ') || 'none');
} finally {
  await browser.close();
  server.kill();
}
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) { console.log('FAILED:', failed.map((f) => f.name).join(', ')); process.exitCode = 1; }
