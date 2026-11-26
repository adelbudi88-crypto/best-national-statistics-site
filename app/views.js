// views.js — hash-routed pages for DataNusa. Every page is rendered from
// data.js; every button, tab, select and sortable header does what it says.
import {
  YEARS, SOURCES, POPULATION_POINTS, POP_GROWTH, POP_FACTS, TOP_PROVINCES,
  DUKCAPIL_TOTAL, PYRAMID_2025, PYRAMID_TOTALS, AGE_BROAD, TOP10_PROVINCES,
  UMP, TODAY_PRICES, GDP, GDP_SECTORS_2025, INFLATION, INFLATION_COMPONENTS_DEC2025, INFLATION_TARGET,
  TPT, LABOR_FEB2025, TPT_PROVINCES, POVERTY, POVERTY_MAR2025, IPM, IPM_COMPONENTS,
  STUNTING, CHILD_NUTRITION, STUNTING_COUNT_2024, TRADE,
  EXPORT_DESTINATIONS_2025, EXPORT_TOP_2025, IMPORT_TOP_2025, RELEASES, MASTER_ROWS, MASTER_COLUMNS,
} from './data.js';
import { drawLineChart, drawBarChart, drawGroupedBars, drawHorizontalBars, drawSparkline, drawPyramid } from './charts.js';

const fmt = (n, d = 2) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmt1 = (n) => Number(n).toLocaleString('id-ID', { maximumFractionDigits: 1 });

export function downloadCSV(filename, header, rows) {
  const esc = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const text = [header.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function kpi(label, value, sub, route) {
  return `<a class="kpi" href="${route}"><span class="kpi-label">${label}</span><span class="kpi-value">${value}</span><span class="kpi-sub">${sub}</span></a>`;
}
function sourceNote(text) { return `<p class="source">Sumber: ${text}</p>`; }
function pageHead(title, intro, source) {
  return `<div class="page-head"><h1>${title}</h1><p class="lede">${intro}</p>${source ? sourceNote(source) : ''}</div>`;
}
function tabBar(tabs, active) {
  return `<div class="tabs" role="tablist">${tabs.map((t) => `<button type="button" role="tab" aria-selected="${t.id === active}" data-tab="${t.id}" class="${t.id === active ? 'active' : ''}">${t.label}</button>`).join('')}</div>`;
}
function chartCard(title, canvasId, height, note) {
  return `<section class="card chart-card"><h2>${title}</h2><div class="chart-wrap"><canvas id="${canvasId}" data-height="${height || 300}"></canvas></div>${note ? `<p class="card-note">${note}</p>` : ''}</section>`;
}
function wireTabs(container, onChange) {
  container.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-tab]').forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      onChange(btn.dataset.tab);
    });
  });
}
function redrawOnResize(draw) {
  let t = null;
  const fn = () => { clearTimeout(t); t = setTimeout(draw, 120); };
  window.addEventListener('resize', fn);
}

// ---------------------------------------------------------------- home ----
export function viewHome(root) {
  root.innerHTML = `
  ${pageHead('Indonesia dalam angka',
    'Penduduk, ekonomi, harga, pekerjaan, pendidikan, kesehatan, dan perdagangan — dari rilis resmi terbaru, dengan tahun dan sumber yang jelas.',
    SOURCES.bps + ' · Kemenkes RI · Bank Indonesia')}
  <div class="kpi-grid" id="kpi-grid"></div>

  <div class="two-col home-charts">
    ${chartCard('PDB nominal, 2021–2025 (Rp triliun)', 'home-gdp', 220, 'PDB 2025 Rp23.821,1 triliun; tumbuh 5,11%.')}
    ${chartCard('Inflasi yoy, 2021–2025 (%)', 'home-inf', 220, 'Puncak 5,51% pada 2022; 2,92% pada Desember 2025.')}
  </div>

  <section class="card">
    <h2>Sepuluh provinsi teratas</h2>
    <p class="card-note">Provinsi dengan penduduk terbanyak — klik judul kolom untuk mengurutkan menurut penduduk, PDRB per kapita, atau IPM.</p>
    <div class="table-scroll"><table class="data-table sortable" id="top10-table">
      <thead><tr>
        <th>#</th>
        <th><button type="button" data-sort="name">Provinsi <span class="sort-mark"></span></button></th>
        <th><button type="button" data-sort="pop">Penduduk (juta) <span class="sort-mark"></span></button></th>
        <th><button type="button" data-sort="pdrbPerCapita">PDRB per kapita (Rp juta) <span class="sort-mark"></span></button></th>
        <th><button type="button" data-sort="ipm">IPM 2025 <span class="sort-mark"></span></button></th>
      </tr></thead>
      <tbody></tbody>
    </table></div>
    <p class="card-note">Sumber: penduduk — BPS Proyeksi 2026 &amp; Dukcapil Semester II 2025; PDRB per kapita — BPS, PDRB Provinsi 2021–2025 (rilis 13 Apr 2026, angka 2025 sangat sementara); IPM — BPS, IPM 2025 (rilis 5 Nov 2025). PDRB per kapita adalah nilai output per penduduk, bukan pendapatan yang diterima tiap orang.</p>
  </section>

  <section class="card">
    <h2>Angka hari ini · ${TODAY_PRICES.date}</h2>
    <div class="today-strip">
      <div class="today-item"><span class="today-label">Dolar AS — kurs transaksi BI</span><span class="today-value">Rp18.211–18.395</span><span class="today-sub">Beli–jual per US$1, 26 Nov 2026</span></div>
      <div class="today-item"><span class="today-label">Rupiah spot</span><span class="today-value">Rp18.401/US$</span><span class="today-sub">Rekor terlemah, 26 Nov 2026 siang; tutup Rp18.335</span></div>
      <div class="today-item"><span class="today-label">Beras medium</span><span class="today-value">Rp14.670/kg</span><span class="today-sub">BPS, minggu ke-3 Nov 2026 (−0,02% vs Okt)</span></div>
      <div class="today-item"><span class="today-label">Beras premium</span><span class="today-value">Rp16.548/kg</span><span class="today-sub">BPS, minggu ke-3 Nov 2026 (+0,12% vs Okt)</span></div>
      <div class="today-item"><span class="today-label">Pertalite</span><span class="today-value">Rp10.000/L</span><span class="today-sub">Pertamina, wilayah Jawa</span></div>
      <div class="today-item"><span class="today-label">Pertamax</span><span class="today-value">Rp15.950/L</span><span class="today-sub">Pertamina, wilayah Jawa; berlaku sejak 2 Sep 2026</span></div>
    </div>
    <p class="card-note">Sumber: Bank Indonesia (kurs transaksi), BPS (harga beras), Pertamina Patra Niaga (BBM). Harga BBM berbeda antarwilayah; yang ditampilkan adalah wilayah Jawa.</p>
  </section>

  <section class="card">
    <h2>Rilis resmi terbaru</h2>
    <ul class="releases">${RELEASES.map((r) => `<li><span class="rel-date">${r.date}</span><span class="rel-title">${r.title}</span><span class="rel-src">${r.source}</span></li>`).join('')}</ul>
  </section>`;

  // --- 10 KPI, each with a sparkline of its own 2021–2025 series + delta ---
  const kpis = [
    { label: 'Penduduk', value: '284,44 jt', sub: 'Proyeksi pertengahan 2025 · BPS', route: '#/penduduk', series: POPULATION_POINTS.map((d) => d.pop), color: '#0e7490', delta: '▲ 1,08%/thn', dir: 'up' },
    { label: 'PDB', value: 'Rp23.821 T', sub: '2025 · tumbuh 5,11%', route: '#/ekonomi', series: GDP.nominal.map((d) => d.value), color: '#0e7490', delta: '▲ 5,11% (2025)', dir: 'up' },
    { label: 'Inflasi', value: '2,92%', sub: 'yoy Desember 2025 · sasaran 2,5% ± 1%', route: '#/harga', series: INFLATION.map((d) => d.value), color: '#c2410c', delta: '▲ 1,35 poin vs 2024', dir: 'down' },
    { label: 'Pengangguran', value: '4,76%', sub: 'TPT Februari 2025 · terendah sejak 1995', route: '#/kerja', series: TPT.map((d) => d.value), color: '#0e7490', delta: '▼ 0,06 poin vs 2024', dir: 'up' },
    { label: 'Kemiskinan', value: '8,47%', sub: 'Maret 2025 · 23,85 juta jiwa', route: '#/kerja', series: POVERTY.map((d) => d.value), color: '#0e7490', delta: '▼ 0,56 poin vs 2024', dir: 'up' },
    { label: 'IPM', value: '75,90', sub: '2025 · kategori tinggi', route: '#/pendidikan', series: IPM.map((d) => d.value), color: '#0e7490', delta: '▲ 0,88 poin vs 2024', dir: 'up' },
    { label: 'Ekspor', value: 'US$282,91 M', sub: '2025 · +6,15% vs 2024', route: '#/perdagangan', series: TRADE.map((t) => t.exports), color: '#0e7490', delta: '▲ US$16,38 M vs 2024', dir: 'up' },
    { label: 'Impor', value: 'US$241,86 M', sub: '2025 · +2,83% vs 2024', route: '#/perdagangan', series: TRADE.map((t) => t.imports), color: '#c2410c', delta: '▲ US$6,66 M vs 2024', dir: 'flat' },
    { label: 'UMP rata-rata', value: 'Rp3,51 jt', sub: 'Per bulan, 2026 · 38 provinsi', route: '#/kerja', series: UMP.series.map((d) => d.value), color: '#0e7490', delta: '▲ 5,91% vs 2025', dir: 'up' },
    { label: 'Stunting', value: '19,8%', sub: 'Balita, 2024 · target 2025: 18,8%', route: '#/kesehatan', series: STUNTING.map((d) => d.value), color: '#0e7490', delta: '▼ 1,7 poin vs 2023', dir: 'up' },
  ];
  const grid = root.querySelector('#kpi-grid');
  grid.innerHTML = kpis.map((k, i) => `<a class="kpi" href="${k.route}"><span class="kpi-label">${k.label}</span><span class="kpi-value">${k.value}</span><canvas class="kpi-spark" data-kpi="${i}" data-height="36"></canvas><span class="kpi-delta ${k.dir}">${k.delta}</span><span class="kpi-sub">${k.sub}</span></a>`).join('');
  const drawSparks = () => {
    root.querySelectorAll('.kpi-spark').forEach((cv) => {
      const k = kpis[Number(cv.dataset.kpi)];
      drawSparkline(cv, k.series, k.color);
    });
  };
  drawSparks();

  // --- Top-10 provinces table, sortable ---
  const topBody = root.querySelector('#top10-table tbody');
  let topKey = 'pop';
  let topDir = -1;
  const renderTop10 = () => {
    const rows = [...TOP10_PROVINCES].sort((a, b) => {
      const av = a[topKey]; const bv = b[topKey];
      return typeof av === 'string' ? av.localeCompare(bv) * topDir : (av - bv) * topDir;
    });
    topBody.innerHTML = rows.map((p, i) => `<tr><td class="rank-cell">${i + 1}</td><td>${p.name}</td><td>${fmt(p.pop)}</td><td>${fmt(p.pdrbPerCapita)}</td><td>${fmt(p.ipm)}</td></tr>`).join('');
    root.querySelectorAll('#top10-table [data-sort]').forEach((btn) => {
      btn.querySelector('.sort-mark').textContent = btn.dataset.sort === topKey ? (topDir === 1 ? '▲' : '▼') : '';
    });
  };
  root.querySelectorAll('#top10-table [data-sort]').forEach((btn) => btn.addEventListener('click', () => {
    if (topKey === btn.dataset.sort) topDir *= -1;
    else { topKey = btn.dataset.sort; topDir = topKey === 'name' ? 1 : -1; }
    renderTop10();
  }));
  renderTop10();

  const draw = () => {
    drawBarChart(root.querySelector('#home-gdp'), {
      labels: GDP.nominal.map((d) => d.year), values: GDP.nominal.map((d) => d.value),
      colors: ['#155e75'], unit: '', seriesName: 'PDB nominal',
    });
    drawLineChart(root.querySelector('#home-inf'), {
      labels: INFLATION.map((d) => d.year),
      series: [{ name: 'Inflasi', values: INFLATION.map((d) => d.value), color: '#c2410c' }],
      unit: '%',
    });
    drawSparks();
  };
  draw();
  redrawOnResize(draw);
}

// ------------------------------------------------------------- penduduk ----
export function viewPenduduk(root) {
  root.innerHTML = `
  ${pageHead('Penduduk',
    'Indonesia berpenduduk 284,44 juta jiwa pada pertengahan 2025 — negara keempat terpadat di dunia. Pertumbuhannya melambat, sementara 69,3% penduduk berada di usia produktif.',
    SOURCES.bpsPop)}
  <div class="kpi-grid">
    ${kpi('Penduduk 2025', '284,44 jt', 'Proyeksi BPS pertengahan tahun', '#/penduduk')}
    ${kpi('Laju tumbuh', '1,08%', 'Per tahun, 2020–2025', '#/penduduk')}
    ${kpi('Usia produktif', '69,3%', '196 juta jiwa (SUPAS 2025)', '#/penduduk')}
    ${kpi('Generasi Z', '24,93%', 'Kelompok generasi terbesar, 2025', '#/penduduk')}
  </div>
  ${tabBar([{ id: 'total', label: 'Jumlah penduduk' }, { id: 'growth', label: 'Laju pertumbuhan' }], 'total')}
  ${chartCard('Penduduk Indonesia menurut sensus & survei (juta jiwa)', 'pop-chart', 300, 'Sensus 2010 & 2020, SUPAS 2015, proyeksi 2025. Arahkan kursor ke titik untuk nilai pastinya.')}
  <div class="two-col">
    ${chartCard('Lima provinsi terpadat (juta jiwa)', 'prov-chart', 280, 'Dukcapil Semester II 2025; total nasional menurut Dukcapil 288,32 juta jiwa — berbeda dari proyeksi BPS karena cara pencatatan administrasi.')}
    <section class="card">
      <h2>Cari provinsi</h2>
      <label class="field">Ketik nama provinsi
        <input id="prov-search" type="search" placeholder="mis. Jawa Barat" autocomplete="off">
      </label>
      <table class="data-table sortable" id="prov-table">
        <thead><tr><th>Provinsi</th><th><button type="button" data-sort="pop">Penduduk (juta) <span class="sort-mark">▼</span></button></th><th><button type="button" data-sort="share">Pangsa (%) <span class="sort-mark"></span></button></th></tr></thead>
        <tbody></tbody>
      </table>
      <p class="card-note" id="prov-count"></p>
    </section>
  </div>
  <div class="two-col">
    ${chartCard('Piramida penduduk, 2025 (juta jiwa)', 'pyramid-chart', 480, 'Laki-laki 143,55 juta jiwa, perempuan 140,89 juta; rasio jenis kelamin 101,9 laki-laki per 100 perempuan. Perempuan lebih banyak mulai kelompok 50–54 tahun ke atas.')}
    <section class="card">
      <h2>Struktur umur</h2>
      <table class="data-table"><thead><tr><th>Kelompok umur</th><th>Pangsa</th><th>Jiwa (juta)</th></tr></thead>
      <tbody>${AGE_BROAD.map((a) => `<tr><td>${a.group}</td><td>${fmt(a.share, 1)}%</td><td>${fmt(a.millions)}</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Indonesia masih dalam bonus demografi: 69,0% penduduk berusia produktif (15–64 tahun). Kelompok 25–29 tahun adalah yang terbesar (22,51 juta jiwa), dan kelompok 0–4 tahun (22,75 juta) menandai masuknya Generasi Beta.</p>
      <p class="card-note">Sumber: BPS, Jumlah Penduduk menurut Kelompok Umur dan Jenis Kelamin 2025 (diperbarui 9 Mei 2025).</p>
    </section>
  </div>
  <section class="card"><h2>Yang perlu dibaca dari angka ini</h2>
    <p>Laju pertumbuhan penduduk turun dari 1,43% per tahun (2010–2015) menjadi 1,08% (2020–2025). Jawa masih menampung lebih dari separuh penduduk: tiga provinsi terpadat — Jawa Barat, Jawa Timur, Jawa Tengah — saja sudah 131,07 juta jiwa. Median provinsi hanya 3,78 juta jiwa, dan provinsi terkecil, Papua Selatan, berpenduduk 0,55 juta jiwa.</p>
  </section>`;

  const canvas = root.querySelector('#pop-chart');
  let mode = 'total';
  const drawPop = () => {
    if (mode === 'total') {
      drawLineChart(canvas, {
        labels: POPULATION_POINTS.map((d) => d.year),
        series: [{ name: 'Penduduk', values: POPULATION_POINTS.map((d) => d.pop), color: '#0e7490' }],
        unit: ' jt',
      });
    } else {
      drawBarChart(canvas, {
        labels: POP_GROWTH.map((d) => d.period),
        values: POP_GROWTH.map((d) => d.rate),
        colors: ['#0e7490', '#0891b2', '#c2410c'],
        unit: '%', seriesName: 'Laju tumbuh',
      });
    }
  };
  drawPop();
  redrawOnResize(drawPop);
  wireTabs(root, (tab) => { mode = tab; drawPop(); });

  drawHorizontalBars(root.querySelector('#prov-chart'), {
    labels: TOP_PROVINCES.map((p) => p.name),
    values: TOP_PROVINCES.map((p) => p.pop),
    colors: ['#0e7490', '#155e75', '#0891b2', '#0369a1', '#c2410c'],
    unit: ' jt',
  });

  const drawPyr = () => drawPyramid(root.querySelector('#pyramid-chart'), PYRAMID_2025);
  drawPyr();
  redrawOnResize(() => { drawPop(); drawPyr(); });

  const tbody = root.querySelector('#prov-table tbody');
  const count = root.querySelector('#prov-count');
  let provKey = 'pop';
  let provDir = -1;
  const renderProv = (q) => {
    const list = TOP_PROVINCES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (a[provKey] - b[provKey]) * provDir);
    tbody.innerHTML = list.map((p) => `<tr><td>${p.name}</td><td>${fmt(p.pop)}</td><td>${fmt(p.share, 1)}</td></tr>`).join('') ||
      `<tr><td colspan="3">Tidak ada provinsi yang cocok dengan “${q}”. Daftar ini memuat 5 provinsi terpadat.</td></tr>`;
    count.textContent = list.length ? `Menampilkan ${list.length} dari 5 provinsi terpadat.` : 'Tidak ada hasil.';
    root.querySelectorAll('#prov-table [data-sort]').forEach((btn) => {
      btn.querySelector('.sort-mark').textContent = btn.dataset.sort === provKey ? (provDir === 1 ? '▲' : '▼') : '';
    });
  };
  root.querySelector('#prov-search').addEventListener('input', (e) => renderProv(e.target.value));
  root.querySelectorAll('#prov-table [data-sort]').forEach((btn) => btn.addEventListener('click', () => {
    if (provKey === btn.dataset.sort) provDir *= -1;
    else { provKey = btn.dataset.sort; provDir = -1; }
    renderProv(root.querySelector('#prov-search').value);
  }));
  renderProv('');
}

// -------------------------------------------------------------- ekonomi ----
export function viewEkonomi(root) {
  root.innerHTML = `
  ${pageHead('Ekonomi',
    'Perekonomian Indonesia 2025 bernilai Rp23.821,1 triliun dan tumbuh 5,11% — lebih cepat dari 5,03% pada 2024. PDB per kapita menembus Rp83,7 juta.',
    SOURCES.bpsGdp)}
  <div class="kpi-grid">
    ${kpi('PDB 2025', 'Rp23.821 T', 'Harga berlaku', '#/ekonomi')}
    ${kpi('Tumbuh', '5,11%', '2025, dari 5,03% pada 2024', '#/ekonomi')}
    ${kpi('PDB per kapita', 'Rp83,7 jt', '2025 · 2024: Rp78,6 jt', '#/ekonomi')}
    ${kpi('PDB per kapita (US$)', 'US$5.083', '2025 · 2024: US$4.960', '#/ekonomi')}
  </div>
  ${tabBar([{ id: 'nominal', label: 'PDB nominal' }, { id: 'growth', label: 'Pertumbuhan (%)' }], 'nominal')}
  ${chartCard('Produk Domestik Bruto (Rp triliun, harga berlaku)', 'gdp-chart', 300, 'PDB naik sekitar 40% dalam lima tahun, dari Rp16.977 triliun pada 2021.')}
  <div class="two-col">
    <section class="card"><h2>PDB per kapita</h2>
      <table class="data-table"><thead><tr><th>Tahun</th><th>Rp juta</th><th>US$</th></tr></thead>
      <tbody>${GDP.perCapita.map((d) => `<tr><td>${d.year}</td><td>${fmt(d.rupiahJt, 1)}</td><td>${d.usd == null ? '—' : d.usd.toLocaleString('id-ID')}</td></tr>`).join('')}</tbody></table>
      <p class="card-note">PDB per kapita 2024 setara Rp6,5 juta per bulan.</p>
      <button type="button" class="btn" id="gdp-csv">Unduh data PDB (CSV)</button>
    </section>
    <section class="card"><h2>Membaca trennya</h2>
      <p>Setelah pemulihan 2022 (5,31%), pertumbuhan bertahan di kisaran 5%: 5,05% pada 2023, 5,03% pada 2024, lalu 5,11% pada 2025. Lapangan usaha jasa lainnya mencatat pertumbuhan tertinggi dari sisi produksi pada 2024 (9,80%), sementara dari sisi pengeluaran, konsumsi lembaga nonprofit yang melayani rumah tangga tumbuh 12,48%.</p>
    </section>
  </div>
  ${chartCard('PDB menurut lapangan usaha, 2025 (Rp triliun)', 'sector-chart', 300, 'Lima lapangan usaha terbesar menyumbang 63,92% PDB. Industri pengolahan tumbuh 5,30%, perdagangan 5,49%, pertanian 5,33%; pertambangan satu-satunya yang terkontraksi (−0,66%).')}
  <div class="two-col">
    <section class="card"><h2>PDB per lapangan usaha, 2025</h2>
      <table class="data-table"><thead><tr><th>Lapangan usaha</th><th>Rp triliun</th><th>Pangsa</th></tr></thead>
      <tbody>${GDP_SECTORS_2025.map((s) => `<tr><td>${s.name}</td><td>${fmt(s.value, 1)}</td><td>${fmt(s.share)}%</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Sumber: BPS, Berita Resmi Statistik 5 Feb 2026 &amp; Pendapatan Nasional Indonesia 2021–2025.</p>
    </section>
    <section class="card"><h2>Komoditas ekspor &amp; impor, 2025</h2>
      <table class="data-table"><thead><tr><th>Ekspor — 5 teratas (HS)</th><th>US$ M</th><th>Pangsa</th></tr></thead>
      <tbody>${EXPORT_TOP_2025.map((c) => `<tr><td>${c.name}</td><td>${fmt(c.value)}</td><td>${fmt(c.share, 1)}%</td></tr>`).join('')}</tbody></table>
      <table class="data-table" style="margin-top:14px"><thead><tr><th>Impor — 3 terbesar (HS)</th><th>US$ M</th><th>Pangsa</th></tr></thead>
      <tbody>${IMPORT_TOP_2025.map((c) => `<tr><td>${c.name}</td><td>${fmt(c.value)}</td><td>${fmt(c.share)}%</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Tiga kategori impor terbesar saja sudah lebih dari 43% total impor. Di dalam HS 27 ekspor: batu bara US$24,48 M; di dalam HS 15: minyak sawit &amp; turunannya US$24,42 M.</p>
      <button type="button" class="btn" id="commodity-csv">Unduh data komoditas 2025 (CSV)</button>
    </section>
  </div>`;

  const canvas = root.querySelector('#gdp-chart');
  let mode = 'nominal';
  const draw = () => {
    if (mode === 'nominal') {
      drawBarChart(canvas, {
        labels: GDP.nominal.map((d) => d.year), values: GDP.nominal.map((d) => d.value),
        colors: ['#155e75'], unit: '', seriesName: 'PDB nominal',
      });
    } else {
      drawLineChart(canvas, {
        labels: GDP.growth.map((d) => d.year),
        series: [{ name: 'Pertumbuhan', values: GDP.growth.map((d) => d.value), color: '#c2410c' }],
        unit: '%', minZero: false,
      });
    }
  };
  draw();
  const drawSector = () => drawBarChart(root.querySelector('#sector-chart'), {
    labels: ['Industri', 'Perdagangan', 'Pertanian', 'Konstruksi', 'Pertambangan'],
    values: GDP_SECTORS_2025.map((s) => s.value),
    colors: ['#0e7490', '#155e75', '#0891b2', '#0369a1', '#c2410c'],
    unit: '', seriesName: 'PDB lapangan usaha',
  });
  drawSector();
  redrawOnResize(() => { draw(); drawSector(); });
  wireTabs(root, (tab) => { mode = tab; draw(); });
  root.querySelector('#gdp-csv').addEventListener('click', () => downloadCSV('pdb-indonesia-2021-2025.csv',
    ['Tahun', 'PDB nominal (Rp triliun)', 'Pertumbuhan (%)'],
    GDP.nominal.map((d, i) => [d.year, d.value, GDP.growth[i].value])));
  root.querySelector('#commodity-csv').addEventListener('click', () => downloadCSV('komoditas-ekspor-impor-2025.csv',
    ['Arus', 'Golongan', 'Nilai (US$ miliar)', 'Pangsa (%)'],
    [
      ...EXPORT_TOP_2025.map((c) => ['Ekspor', c.name, c.value, c.share]),
      ...IMPORT_TOP_2025.map((c) => ['Impor', c.name, c.value, c.share]),
    ]));
}

// ---------------------------------------------------------------- harga ----
export function viewHarga(root) {
  root.innerHTML = `
  ${pageHead('Harga & inflasi',
    'Inflasi 2025 tercatat 2,92% (yoy) — naik dari 1,57% pada 2024, tetapi tetap dalam sasaran Bank Indonesia 2,5% ± 1%. Pendorong utamanya: makanan, minuman, dan tembakau.',
    SOURCES.bpsInflation)}
  <div class="kpi-grid">
    ${kpi('Inflasi 2025', '2,92%', 'yoy Desember 2025', '#/harga')}
    ${kpi('Inflasi 2024', '1,57%', 'yoy Desember 2024', '#/harga')}
    ${kpi('Inflasi inti', '2,38%', 'Desember 2025', '#/harga')}
    ${kpi('Volatile food', '6,21%', 'Desember 2025', '#/harga')}
  </div>
  ${tabBar([{ id: 'yearly', label: 'Inflasi tahunan' }, { id: 'components', label: 'Komponen Des 2025' }], 'yearly')}
  ${chartCard('Inflasi tahunan, 2021–2025 (% yoy)', 'inf-chart', 300, 'Puncak 5,51% pada 2022, terendah 1,57% pada 2024.')}
  <section class="card" id="comp-card" hidden>
    <h2>Komponen inflasi, Desember 2025</h2>
    <table class="data-table"><thead><tr><th>Komponen</th><th>yoy (%)</th><th>Penyumbang utama</th></tr></thead>
    <tbody>${INFLATION_COMPONENTS_DEC2025.map((c) => `<tr><td>${c.name}</td><td>${fmt(c.value)}</td><td>${c.note}</td></tr>`).join('')}</tbody></table>
    <p class="card-note">Kelompok makanan, minuman, dan tembakau naik 4,58% dan memberi andil inflasi 1,33 poin. Komoditas penyumbang terbesar: cabai merah, ikan segar, cabai rawit, beras, dan daging ayam ras.</p>
  </section>
  <section class="card"><h2>Kenapa 2025 naik lagi?</h2>
    <p>Setelah mereda ke 1,57% pada 2024, inflasi kembali naik pada 2025 karena harga pangan bergejolak (volatile food 6,21%, dari 0,12% setahun sebelumnya) dan inflasi inti yang menguat ke 2,38%, antara lain dari perhiasan emas dan minyak goreng. Harga yang diatur pemerintah (administered prices) naik 1,93%.</p>
  </section>`;

  const canvas = root.querySelector('#inf-chart');
  const card = root.querySelector('#comp-card');
  let mode = 'yearly';
  const draw = () => {
    if (mode === 'yearly') {
      drawLineChart(canvas, {
        labels: INFLATION.map((d) => d.year),
        series: [{ name: 'Inflasi', values: INFLATION.map((d) => d.value), color: '#c2410c' }],
        unit: '%',
      });
    } else {
      drawBarChart(canvas, {
        labels: INFLATION_COMPONENTS_DEC2025.map((c) => c.name),
        values: INFLATION_COMPONENTS_DEC2025.map((c) => c.value),
        colors: ['#0e7490', '#c2410c', '#155e75'], unit: '%', seriesName: 'Inflasi komponen',
      });
    }
  };
  draw();
  redrawOnResize(draw);
  wireTabs(root, (tab) => {
    mode = tab;
    card.hidden = tab !== 'components';
    draw();
  });
}

// --------------------------------------------------------------- kerja -----
export function viewKerja(root) {
  root.innerHTML = `
  ${pageHead('Ketenagakerjaan & kemiskinan',
    'Tingkat pengangguran terbuka Februari 2025 sebesar 4,76% — terendah sejak 1995 — dengan angkatan kerja 153,05 juta orang. Kemiskinan Maret 2025 sebesar 8,47%, terendah sepanjang sejarah.',
    SOURCES.bpsLabor + ' · ' + SOURCES.bpsPoverty)}
  <div class="kpi-grid">
    ${kpi('TPT', '4,76%', 'Februari 2025', '#/kerja')}
    ${kpi('Angkatan kerja', '153,05 jt', 'Februari 2025 · +3,67 jt setahun', '#/kerja')}
    ${kpi('Penganggur', '7,28 jt', 'Februari 2025', '#/kerja')}
    ${kpi('Kemiskinan', '8,47%', 'Maret 2025 · 23,85 juta jiwa', '#/kerja')}
  </div>
  ${tabBar([{ id: 'tpt', label: 'Pengangguran (TPT)' }, { id: 'poverty', label: 'Kemiskinan' }], 'tpt')}
  ${chartCard('Tingkat pengangguran terbuka, Februari 2021–2025 (%)', 'tpt-chart', 300, 'TPT turun setiap tahun sejak 2021.')}
  <div class="two-col">
    <section class="card"><h2>Kemiskinan, Maret 2025</h2>
      <table class="data-table"><thead><tr><th>Ukuran</th><th>Nilai</th></tr></thead><tbody>
        <tr><td>Tingkat kemiskinan</td><td>8,47%</td></tr>
        <tr><td>Jumlah penduduk miskin</td><td>23,85 juta jiwa</td></tr>
        <tr><td>Perkotaan</td><td>6,73%</td></tr>
        <tr><td>Perdesaan</td><td>11,03%</td></tr>
        <tr><td>Kemiskinan ekstrem</td><td>0,85% (2,38 juta orang)</td></tr>
        <tr><td>Garis kemiskinan</td><td>Rp609.160 / kapita / bulan</td></tr>
      </tbody></table>
      <p class="card-note">Jumlah penduduk miskin turun 210 ribu jiwa dibanding September 2024 (24,06 juta).</p>
    </section>
    <section class="card"><h2>TPT menurut provinsi, 2025</h2>
      <table class="data-table"><thead><tr><th>Wilayah</th><th>TPT (%)</th></tr></thead><tbody>
        ${TPT_PROVINCES.map((p) => `<tr><td>${p.name}</td><td>${fmt(p.value)}</td></tr>`).join('')}
      </tbody></table>
      <p class="card-note">Papua mencatat TPT tertinggi (6,92%), diikuti DKI Jakarta (6,18%). Angkatan kerja Februari 2025 sebanyak 153,05 juta orang; yang bekerja 145,77 juta orang.</p>
      <button type="button" class="btn" id="kerja-csv">Unduh data kerja &amp; miskin (CSV)</button>
    </section>
    <section class="card"><h2>Upah minimum provinsi (UMP)</h2>
      <table class="data-table"><thead><tr><th>Ukuran</th><th>Nilai</th></tr></thead><tbody>
        <tr><td>Rata-rata UMP 2026 (38 provinsi)</td><td>Rp3,51 juta/bulan</td></tr>
        <tr><td>Kenaikan rata-rata vs 2025</td><td>5,91%</td></tr>
        <tr><td>UMP tertinggi — DKI Jakarta</td><td>Rp5.729.876/bulan</td></tr>
        <tr><td>UMP terendah — Jawa Barat</td><td>Rp2.317.601/bulan</td></tr>
      </tbody></table>
      <p class="card-note">Sumber: Kemnaker (Satudata) &amp; SK Gubernur 38 provinsi, PP 49/2025 tentang Pengupahan. Rata-rata upah buruh nasional Agustus 2025 sebesar Rp3,33 juta, naik menjadi Rp3,42 juta pada Agustus 2026 (BPS).</p>
    </section>
  </div>`;

  const canvas = root.querySelector('#tpt-chart');
  let mode = 'tpt';
  const draw = () => {
    if (mode === 'tpt') {
      drawLineChart(canvas, {
        labels: TPT.map((d) => d.year),
        series: [{ name: 'TPT', values: TPT.map((d) => d.value), color: '#0e7490' }],
        unit: '%', minZero: false,
      });
    } else {
      drawLineChart(canvas, {
        labels: POVERTY.map((d) => d.year),
        series: [{ name: 'Kemiskinan', values: POVERTY.map((d) => d.value), color: '#c2410c' }],
        unit: '%', minZero: false,
      });
    }
  };
  draw();
  redrawOnResize(draw);
  wireTabs(root, (tab) => { mode = tab; draw(); });
  root.querySelector('#kerja-csv').addEventListener('click', () => downloadCSV('kerja-kemiskinan-indonesia-2021-2025.csv',
    ['Tahun', 'TPT Februari (%)', 'Kemiskinan Maret (%)'],
    YEARS.map((y) => [y, TPT.find((d) => d.year === y).value, POVERTY.find((d) => d.year === y).value])));
}

// ----------------------------------------------------------- pendidikan ----
export function viewPendidikan(root) {
  root.innerHTML = `
  ${pageHead('Pendidikan & pembangunan manusia',
    'Indeks Pembangunan Manusia 2025 mencapai 75,90 — kategori tinggi — naik 0,88 poin dari 75,02 pada 2024. Semua komponen penyusunnya meningkat.',
    SOURCES.bpsHdi)}
  <div class="kpi-grid">
    ${kpi('IPM 2025', '75,90', 'Naik 0,88 poin dari 2024', '#/pendidikan')}
    ${kpi('Harapan hidup', '74,47 th', 'Saat lahir, 2025', '#/pendidikan')}
    ${kpi('Harapan sekolah', '13,30 th', 'Usia 7 tahun ke atas, 2025', '#/pendidikan')}
    ${kpi('Rata-rata sekolah', '9,07 th', 'Usia 25 tahun ke atas, 2025', '#/pendidikan')}
  </div>
  ${chartCard('Indeks Pembangunan Manusia, 2022–2025', 'ipm-chart', 300, 'IPM naik konsisten sejak 2022 (73,77).')}
  <div class="two-col">
    <section class="card"><h2>Komponen IPM</h2>
      <label class="field">Tahun
        <select id="ipm-year"><option value="2025" selected>2025</option><option value="2024">2024</option></select>
      </label>
      <table class="data-table"><tbody id="ipm-body"></tbody></table>
      <p class="card-note">Rata-rata lama sekolah 9,07 tahun setara kelas 3 SMP; harapan lama sekolah 13,30 tahun setara tahun kedua kuliah.</p>
    </section>
    <section class="card"><h2>Membaca IPM</h2>
      <p>IPM menggabungkan tiga dimensi: umur panjang dan hidup sehat (harapan hidup), pengetahuan (harapan lama sekolah dan rata-rata lama sekolah), serta standar hidup layak (pengeluaran riil per kapita yang disesuaikan). Pada 2025, pengeluaran riil per kapita naik Rp461 ribu, harapan lama sekolah naik 0,09 tahun, rata-rata lama sekolah naik 0,22 tahun, dan harapan hidup naik 0,32 tahun.</p>
    </section>
  </div>`;

  drawLineChart(root.querySelector('#ipm-chart'), {
    labels: IPM.map((d) => d.year),
    series: [{ name: 'IPM', values: IPM.map((d) => d.value), color: '#0e7490' }],
    minZero: false,
  });
  const body = root.querySelector('#ipm-body');
  const renderIpm = () => {
    const y = root.querySelector('#ipm-year').value;
    const c = IPM_COMPONENTS[y];
    body.innerHTML = `
      <tr><td>IPM</td><td>${fmt(IPM.find((d) => d.year === Number(y)).value)}</td></tr>
      <tr><td>Umur harapan hidup saat lahir</td><td>${fmt(c.uhh)} tahun</td></tr>
      <tr><td>Harapan lama sekolah</td><td>${fmt(c.hls)} tahun</td></tr>
      <tr><td>Rata-rata lama sekolah</td><td>${fmt(c.rls)} tahun</td></tr>`;
  };
  root.querySelector('#ipm-year').addEventListener('change', renderIpm);
  renderIpm();
}

// ------------------------------------------------------------ kesehatan ----
export function viewKesehatan(root) {
  root.innerHTML = `
  ${pageHead('Kesehatan',
    'Prevalensi stunting balita turun ke 19,8% pada 2024 — dari 21,5% pada 2023 dan 37,6% pada 2013. Sekitar 4,48 juta balita masih mengalami stunting.',
    SOURCES.kemenkes)}
  <div class="kpi-grid">
    ${kpi('Stunting', '19,8%', 'Balita, 2024 · target 2025: 18,8%', '#/kesehatan')}
    ${kpi('Wasting', '7,4%', 'Balita, 2024', '#/kesehatan')}
    ${kpi('Overweight', '3,4%', 'Balita, 2024', '#/kesehatan')}
    ${kpi('Harapan hidup', '74,47 th', '2025 · BPS', '#/kesehatan')}
  </div>
  ${tabBar([{ id: 'stunting', label: 'Tren stunting' }, { id: 'gizi', label: 'Gizi balita 2013 vs 2024' }], 'stunting')}
  ${chartCard('Prevalensi stunting balita, 2019–2024 (%)', 'stunting-chart', 300, 'Tidak ada survei pada 2020. SSGI 2024 mencakup 38 provinsi dan 514 kabupaten/kota.')}
  <div class="two-col">
    <section class="card"><h2>Di mana stunting terbanyak?</h2>
      <p>Separuh balita stunting — sekitar 2,24 juta anak — terkonsentrasi di enam provinsi: Jawa Barat (638 ribu), Jawa Tengah (486 ribu), Jawa Timur (431 ribu), Sumatera Utara (316 ribu), Nusa Tenggara Timur (214 ribu), dan Banten (210 ribu). Prevalensi terendah ada di Bali (8,6%).</p>
    </section>
    <section class="card"><h2>Target</h2>
      <p>Pemerintah menargetkan stunting turun ke 18,8% pada 2025 dan 14,2% pada 2029, sesuai RPJMN. SSGI 2024 mencatat sekitar 377 ribu stunting baru berhasil dicegah selama 2024.</p>
      <button type="button" class="btn" id="sehat-csv">Unduh data gizi balita (CSV)</button>
    </section>
  </div>`;

  const canvas = root.querySelector('#stunting-chart');
  let mode = 'stunting';
  const draw = () => {
    if (mode === 'stunting') {
      drawLineChart(canvas, {
        labels: STUNTING.map((d) => d.year),
        series: [{ name: 'Stunting', values: STUNTING.map((d) => d.value), color: '#0e7490' }],
        unit: '%',
      });
    } else {
      drawGroupedBars(canvas, {
        labels: CHILD_NUTRITION.map((c) => c.name),
        series: [
          { name: '2013', values: CHILD_NUTRITION.map((c) => c.y2013), color: '#94a3b8' },
          { name: '2024', values: CHILD_NUTRITION.map((c) => c.y2024), color: '#0e7490' },
        ],
        unit: '%',
      });
    }
  };
  draw();
  redrawOnResize(draw);
  wireTabs(root, (tab) => { mode = tab; draw(); });
  root.querySelector('#sehat-csv').addEventListener('click', () => downloadCSV('gizi-balita-indonesia.csv',
    ['Indikator', '2013 (%)', '2024 (%)'],
    CHILD_NUTRITION.map((c) => [c.name, c.y2013, c.y2024])));
}

// ----------------------------------------------------------- perdagangan ---
export function viewPerdagangan(root) {
  root.innerHTML = `
  ${pageHead('Perdagangan luar negeri',
    'Ekspor 2025 mencapai US$282,91 miliar dan impor US$241,86 miliar — surplus US$41,05 miliar, naik dari US$31,33 miliar pada 2024 dan menjadi surplus tahunan terbesar. Neraca dagang surplus setiap bulan sejak Mei 2020.',
    SOURCES.bpsTrade2025)}
  <div class="kpi-grid">
    ${kpi('Ekspor 2025', 'US$282,91 M', 'Naik 6,15% dari 2024', '#/perdagangan')}
    ${kpi('Impor 2025', 'US$241,86 M', 'Naik 2,83% dari 2024', '#/perdagangan')}
    ${kpi('Surplus 2025', 'US$41,05 M', 'Nonmigas US$60,75 M; migas defisit US$19,70 M', '#/perdagangan')}
    ${kpi('Surplus beruntun', '68 bln', 'Bulan surplus berturut-turut, Mei 2020–Des 2025', '#/perdagangan')}
  </div>
  ${chartCard('Ekspor vs impor, 2021–2025 (US$ miliar)', 'trade-chart', 300, 'Ekspor memuncak pada 2022 (US$291,90 miliar) saat boom harga komoditas, lalu kembali naik pada 2025.')}
  <div class="two-col">
    <section class="card"><h2>Neraca perdagangan</h2>
      <table class="data-table"><thead><tr><th>Tahun</th><th>Ekspor</th><th>Impor</th><th>Surplus</th></tr></thead>
      <tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td>${fmt(t.exports)}</td><td>${fmt(t.imports)}</td><td>${fmt(t.surplus)}</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Nilai dalam US$ miliar.</p>
      <button type="button" class="btn" id="trade-csv">Unduh data perdagangan (CSV)</button>
    </section>
    <section class="card"><h2>Tujuan ekspor utama, 2025</h2>
      <table class="data-table"><thead><tr><th>Negara</th><th>US$ miliar</th></tr></thead>
      <tbody>${EXPORT_DESTINATIONS_2025.map((d) => `<tr><td>${d.name}</td><td>${fmt(d.value)}</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Nilai setahun penuh 2025, ekspor nonmigas. Tiongkok, Amerika Serikat, dan India adalah tiga tujuan terbesar.</p>
    </section>
  </div>`;

  drawGroupedBars(root.querySelector('#trade-chart'), {
    labels: TRADE.map((t) => t.year),
    series: [
      { name: 'Ekspor', values: TRADE.map((t) => t.exports), color: '#0e7490' },
      { name: 'Impor', values: TRADE.map((t) => t.imports), color: '#c2410c' },
    ],
    unit: '',
  });
  root.querySelector('#trade-csv').addEventListener('click', () => downloadCSV('perdagangan-indonesia-2021-2025.csv',
    ['Tahun', 'Ekspor (US$ miliar)', 'Impor (US$ miliar)', 'Surplus (US$ miliar)'],
    TRADE.map((t) => [t.year, t.exports, t.imports, t.surplus])));
}

// ----------------------------------------------------------------- tabel ---
export function viewTabel(root) {
  root.innerHTML = `
  ${pageHead('Semua data, 2021–2025',
    'Satu tabel untuk semua indikator utama. Klik judul kolom untuk mengurutkan, pilih tahun untuk menyaring, atau unduh sebagai CSV.',
    SOURCES.bps)}
  <div class="table-controls">
    <label class="field">Tahun
      <select id="table-year"><option value="all" selected>Semua tahun</option>${YEARS.map((y) => `<option value="${y}">${y}</option>`).join('')}</select>
    </label>
    <label class="field">Cari indikator
      <input id="table-search" type="search" placeholder="mis. inflasi" autocomplete="off">
    </label>
    <button type="button" class="btn" id="table-csv">Unduh CSV</button>
  </div>
  <div class="table-scroll"><table class="data-table" id="master-table">
    <thead><tr>${MASTER_COLUMNS.map((c) => `<th><button type="button" class="sort-btn" data-key="${c.key}">${c.label} <span class="sort-mark" aria-hidden="true"></span></button></th>`).join('')}</tr></thead>
    <tbody></tbody>
  </table></div>
  <p class="card-note">“—” berarti survei/indikator itu tidak mencakup tahun tersebut (mis. penduduk hanya tersedia untuk 2025 pada tabel ini; deret sensus lengkap ada di halaman Penduduk). Klik judul kolom dua kali untuk membalik urutan.</p>`;

  let sortKey = 'year';
  let sortDir = 1;
  const tbody = root.querySelector('#master-table tbody');
  const render = () => {
    const yearFilter = root.querySelector('#table-year').value;
    const q = root.querySelector('#table-search').value.trim().toLowerCase();
    // The search filters which indicator columns are shown (Tahun always stays).
    const visible = MASTER_COLUMNS.map((c) => q === '' || c.key === 'year' || c.label.toLowerCase().includes(q));
    let rows = [...MASTER_ROWS];
    if (yearFilter !== 'all') rows = rows.filter((r) => r.year === Number(yearFilter));
    rows.sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av - bv) * sortDir;
    });
    tbody.innerHTML = rows.map((r) => `<tr>${MASTER_COLUMNS.map((c) => `<td>${c.format(r[c.key])}</td>`).join('')}</tr>`).join('') ||
      '<tr><td colspan="11">Tidak ada baris yang cocok.</td></tr>';
    root.querySelectorAll('.sort-mark').forEach((m) => { m.textContent = ''; });
    const mark = root.querySelector(`[data-key="${sortKey}"] .sort-mark`);
    if (mark) mark.textContent = sortDir === 1 ? '▲' : '▼';
    root.querySelectorAll('#master-table thead th').forEach((th, i) => { th.style.display = visible[i] ? '' : 'none'; });
    tbody.querySelectorAll('tr').forEach((tr) => tr.querySelectorAll('td').forEach((td, i) => { td.style.display = visible[i] ? '' : 'none'; }));
  };
  root.querySelectorAll('.sort-btn').forEach((btn) => btn.addEventListener('click', () => {
    if (sortKey === btn.dataset.key) sortDir *= -1;
    else { sortKey = btn.dataset.key; sortDir = 1; }
    render();
  }));
  root.querySelector('#table-year').addEventListener('change', render);
  root.querySelector('#table-search').addEventListener('input', render);
  root.querySelector('#table-csv').addEventListener('click', () => downloadCSV('indonesia-indikator-2021-2025.csv',
    MASTER_COLUMNS.map((c) => c.label),
    MASTER_ROWS.map((r) => MASTER_COLUMNS.map((c) => (r[c.key] == null ? '' : r[c.key])))));
  render();
}

// --------------------------------------------------------------- tentang ---
export function viewTentang(root) {
  root.innerHTML = `
  ${pageHead('Tentang DataNusa',
    'DataNusa adalah situs visualisasi statistik yang dibuat independen — bukan situs resmi Badan Pusat Statistik. Semua angka di sini berasal dari rilis resmi dan dicantumkan sumber serta tahunnya.',
    null)}
  <section class="card"><h2>Sumber data</h2>
    <ul class="sources">
      <li><strong>Badan Pusat Statistik (BPS)</strong> — penduduk, PDB, inflasi, ketenagakerjaan, kemiskinan, IPM. Publikasi: Statistik Indonesia, Berita Resmi Statistik, Pendapatan Nasional Indonesia 2021–2025.</li>
      <li><strong>Kementerian Kesehatan RI</strong> — Survei Status Gizi Indonesia (SSGI) 2024.</li>
      <li><strong>Bank Indonesia</strong> — Analisis Inflasi Desember 2025 (bersama BPS).</li>
      <li><strong>Kementerian Perdagangan (PDSI)</strong> — Perkembangan Ekspor–Impor 2024, diolah dari data BPS.</li>
      <li><strong>Ditjen Dukcapil, Kemendagri</strong> — jumlah penduduk menurut provinsi, Semester II 2025.</li>
      <li><strong>Kementerian Ketenagakerjaan (Satudata) &amp; SK Gubernur</strong> — Upah Minimum Provinsi 2026 (38 provinsi), PP 49/2025.</li>
      <li><strong>Bank Indonesia</strong> — Kurs Transaksi 26 November 2026; Pusat Informasi Harga Pangan Strategis Nasional (PIHPS).</li>
      <li><strong>Pertamina Patra Niaga</strong> — daftar harga BBM (berlaku sejak 2 September 2026).</li>
      <li><strong>BPS, PDRB Provinsi menurut Lapangan Usaha 2021–2025</strong> (rilis 13 April 2026) — PDRB per kapita provinsi; angka 2025 berstatus sangat sementara.</li>
    </ul>
    <p>Angka yang ditampilkan adalah angka yang dirilis lembaga tersebut. Jika suatu rilis direvisi di kemudian hari, angka di situs ini mengikuti rilis yang dikutip. Data Dukcapil (administrasi kependudukan) dan proyeksi BPS dihitung dengan cara berbeda, sehingga total nasionalnya tidak sama — keduanya dicantumkan dengan penjelasannya.</p>
  </section>
  <section class="card"><h2>Istilah</h2>
    <dl class="glossary">
      <dt>TPT — Tingkat Pengangguran Terbuka</dt><dd>Persentase angkatan kerja yang tidak bekerja dan sedang mencari pekerjaan (Sakernas, Februari).</dd>
      <dt>IPM — Indeks Pembangunan Manusia</dt><dd>Ukuran gabungan harapan hidup, pendidikan (harapan &amp; rata-rata lama sekolah), dan standar hidup layak. 70–80 berarti kategori tinggi.</dd>
      <dt>Garis kemiskinan</dt><dd>Batas pengeluaran per kapita per bulan untuk memenuhi kebutuhan dasar makanan dan non-makanan (Rp609.160 pada Maret 2025).</dd>
      <dt>IHK — Indeks Harga Konsumen</dt><dd>Ukuran perubahan harga barang dan jasa yang dikonsumsi rumah tangga; inflasi yoy membandingkan IHK bulan ini dengan bulan yang sama tahun lalu.</dd>
      <dt>Stunting</dt><dd>Kondisi gagal tumbuh pada balita karena kekurangan gizi kronis, diukur dari tinggi badan menurut umur di bawah −2 standar deviasi.</dd>
      <dt>SUPAS</dt><dd>Survei Penduduk Antar Sensus, survei BPS di antara dua sensus penduduk.</dd>
    </dl>
  </section>
  <section class="card"><h2>Metode situs ini</h2>
    <p>Situs ini adalah file statis tanpa jaringan: semua angka tersimpan di dalam berkasnya sendiri, semua grafik digambar di kanvas oleh kode situs, dan tidak ada data yang diambil dari server lain saat halaman dibuka. Gunakan pemilih tahun, tab, pencarian, dan pengurutan tabel untuk menjelajahi data — semuanya berjalan di peramban Anda.</p>
  </section>`;
}

export const ROUTES = {
  '': viewHome,
  'penduduk': viewPenduduk,
  'ekonomi': viewEkonomi,
  'harga': viewHarga,
  'kerja': viewKerja,
  'pendidikan': viewPendidikan,
  'kesehatan': viewKesehatan,
  'perdagangan': viewPerdagangan,
  'tabel': viewTabel,
  'tentang': viewTentang,
};
