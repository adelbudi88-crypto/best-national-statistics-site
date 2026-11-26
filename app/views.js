// views.js — hash-routed pages for DataNusa. Every page is rendered from
// data.js; every button, tab, select and sortable header does what it says.
import {
  YEARS, SOURCES, POPULATION_POINTS, POP_GROWTH, POP_FACTS, TOP_PROVINCES,
  DUKCAPIL_TOTAL, GDP, INFLATION, INFLATION_COMPONENTS_DEC2025, INFLATION_TARGET,
  TPT, LABOR_FEB2025, TPT_PROVINCES, POVERTY, POVERTY_MAR2025, IPM, IPM_COMPONENTS,
  STUNTING, CHILD_NUTRITION, STUNTING_COUNT_2024, TRADE,
  EXPORT_DESTINATIONS_DEC2024, RELEASES, MASTER_ROWS, MASTER_COLUMNS,
} from './data.js';
import { drawLineChart, drawBarChart, drawGroupedBars, drawHorizontalBars } from './charts.js';

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
    'Satu tempat untuk membaca Indonesia: penduduk, ekonomi, harga, pekerjaan, pendidikan, kesehatan, dan perdagangan — dari rilis resmi terbaru, dengan tahun dan sumber yang jelas.',
    SOURCES.bps + ' · Kemenkes RI · Bank Indonesia')}
  <div class="kpi-grid">
    ${kpi('Penduduk', '284,44 jt', 'Proyeksi pertengahan 2025 · BPS', '#/penduduk')}
    ${kpi('PDB', 'Rp23.821 T', '2025 · tumbuh 5,11%', '#/ekonomi')}
    ${kpi('Inflasi', '2,92%', 'yoy Desember 2025 · dalam sasaran 2,5% ± 1%', '#/harga')}
    ${kpi('Pengangguran', '4,76%', 'TPT Februari 2025 · terendah sejak 1995', '#/kerja')}
    ${kpi('Kemiskinan', '8,47%', 'Maret 2025 · 23,85 juta jiwa', '#/kerja')}
    ${kpi('IPM', '75,90', '2025 · kategori tinggi', '#/pendidikan')}
  </div>

  <section class="card">
    <h2>Sorotan tahun <span id="spot-year">2025</span></h2>
    <p class="card-note">Pilih tahun untuk melihat angka tahun itu di semua indikator utama. Tahun yang tidak dicakup suatu survei ditandai “—”.</p>
    <label class="field">Tahun fokus
      <select id="year-select">${YEARS.map((y) => `<option value="${y}" ${y === 2025 ? 'selected' : ''}>${y}</option>`).join('')}</select>
    </label>
    <div class="spot-grid" id="spot-grid"></div>
  </section>

  <div class="two-col">
    ${chartCard('Pertumbuhan ekonomi, 2021–2025 (%)', 'home-growth', 280, 'Ekonomi tumbuh di atas 5% dalam empat tahun terakhir; 2025 mencatat 5,11%.')}
    <section class="card">
      <h2>Jelajahi statistik</h2>
      <ul class="explore">
        <li><a href="#/penduduk"><strong>Penduduk</strong><span>284,44 juta jiwa · 5 provinsi terpadat</span></a></li>
        <li><a href="#/ekonomi"><strong>Ekonomi</strong><span>PDB Rp23.821 triliun · PDB per kapita Rp83,7 juta</span></a></li>
        <li><a href="#/harga"><strong>Harga &amp; inflasi</strong><span>2,92% pada Desember 2025</span></a></li>
        <li><a href="#/kerja"><strong>Ketenagakerjaan</strong><span>TPT 4,76% · kemiskinan 8,47%</span></a></li>
        <li><a href="#/pendidikan"><strong>Pendidikan</strong><span>IPM 75,90 · harapan lama sekolah 13,30 tahun</span></a></li>
        <li><a href="#/kesehatan"><strong>Kesehatan</strong><span>Stunting 19,8% · harapan hidup 74,47 tahun</span></a></li>
        <li><a href="#/perdagangan"><strong>Perdagangan</strong><span>Surplus US$31,04 miliar pada 2024</span></a></li>
        <li><a href="#/tabel"><strong>Semua data</strong><span>Tabel 2021–2025, bisa diurutkan &amp; diunduh</span></a></li>
      </ul>
    </section>
  </div>

  <section class="card">
    <h2>Rilis resmi terbaru</h2>
    <ul class="releases">${RELEASES.map((r) => `<li><span class="rel-date">${r.date}</span><span class="rel-title">${r.title}</span><span class="rel-src">${r.source}</span></li>`).join('')}</ul>
  </section>`;

  const spot = root.querySelector('#spot-grid');
  const yearSel = root.querySelector('#year-select');
  const renderSpot = () => {
    const y = Number(yearSel.value);
    root.querySelector('#spot-year').textContent = String(y);
    const row = MASTER_ROWS.find((r) => r.year === y);
    const cell = (label, v, unit) => `<div class="spot"><span class="spot-label">${label}</span><span class="spot-value">${v == null ? '—' : fmt(v) + (unit || '')}</span></div>`;
    spot.innerHTML =
      cell('Pertumbuhan ekonomi', row.gdpGrowth, '%') +
      cell('Inflasi (yoy Des)', row.inflation, '%') +
      cell('TPT (Februari)', row.tpt, '%') +
      cell('Kemiskinan (Maret)', row.poverty, '%') +
      cell('IPM', row.ipm, '') +
      `<div class="spot"><span class="spot-label">PDB nominal</span><span class="spot-value">${row.gdpNominal == null ? '—' : 'Rp' + fmt1(row.gdpNominal) + ' T'}</span></div>` +
      `<div class="spot"><span class="spot-label">Ekspor</span><span class="spot-value">${row.exports == null ? '—' : 'US$' + fmt(row.exports) + ' M'}</span></div>` +
      `<div class="spot"><span class="spot-label">Penduduk</span><span class="spot-value">${row.population == null ? '—' : fmt(row.population) + ' jt'}</span></div>`;
  };
  yearSel.addEventListener('change', renderSpot);
  renderSpot();

  const draw = () => drawLineChart(root.querySelector('#home-growth'), {
    labels: GDP.growth.map((d) => d.year),
    series: [{ name: 'Pertumbuhan PDB', values: GDP.growth.map((d) => d.value), color: '#0e7490' }],
    unit: '%', minZero: false,
  });
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
      <table class="data-table" id="prov-table">
        <thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Pangsa (%)</th></tr></thead>
        <tbody></tbody>
      </table>
      <p class="card-note" id="prov-count"></p>
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

  const tbody = root.querySelector('#prov-table tbody');
  const count = root.querySelector('#prov-count');
  const renderProv = (q) => {
    const list = TOP_PROVINCES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    tbody.innerHTML = list.map((p) => `<tr><td>${p.name}</td><td>${fmt(p.pop)}</td><td>${fmt(p.share, 1)}</td></tr>`).join('') ||
      `<tr><td colspan="3">Tidak ada provinsi yang cocok dengan “${q}”. Daftar ini memuat 5 provinsi terpadat.</td></tr>`;
    count.textContent = list.length ? `Menampilkan ${list.length} dari 5 provinsi terpadat.` : 'Tidak ada hasil.';
  };
  root.querySelector('#prov-search').addEventListener('input', (e) => renderProv(e.target.value));
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
    ${kpi('PDB per kapita (US$)', 'US$4.960', '2024', '#/ekonomi')}
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
  redrawOnResize(draw);
  wireTabs(root, (tab) => { mode = tab; draw(); });
  root.querySelector('#gdp-csv').addEventListener('click', () => downloadCSV('pdb-indonesia-2021-2025.csv',
    ['Tahun', 'PDB nominal (Rp triliun)', 'Pertumbuhan (%)'],
    GDP.nominal.map((d, i) => [d.year, d.value, GDP.growth[i].value])));
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
    'Ekspor 2024 mencapai US$264,70 miliar dan impor US$233,66 miliar — surplus US$31,04 miliar, tahun kelima berturut-turut surplus sejak Mei 2020.',
    SOURCES.kemendag)}
  <div class="kpi-grid">
    ${kpi('Ekspor 2024', 'US$264,70 M', 'Naik 2,29% dari 2023', '#/perdagangan')}
    ${kpi('Impor 2024', 'US$233,66 M', 'Naik 5,31% dari 2023', '#/perdagangan')}
    ${kpi('Surplus 2024', 'US$31,04 M', 'Dari surplus nonmigas US$51,44 M', '#/perdagangan')}
    ${kpi('Surplus terlama', '55 bln', 'Bulan surplus berturut-turut s.d. Nov 2024', '#/perdagangan')}
  </div>
  ${chartCard('Ekspor vs impor, 2021–2024 (US$ miliar)', 'trade-chart', 300, 'Ekspor memuncak pada 2022 (US$291,90 miliar) saat boom harga komoditas.')}
  <div class="two-col">
    <section class="card"><h2>Neraca perdagangan</h2>
      <table class="data-table"><thead><tr><th>Tahun</th><th>Ekspor</th><th>Impor</th><th>Surplus</th></tr></thead>
      <tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td>${fmt(t.exports)}</td><td>${fmt(t.imports)}</td><td>${fmt(t.surplus)}</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Nilai dalam US$ miliar.</p>
      <button type="button" class="btn" id="trade-csv">Unduh data perdagangan (CSV)</button>
    </section>
    <section class="card"><h2>Tujuan ekspor utama, Desember 2024</h2>
      <table class="data-table"><thead><tr><th>Negara</th><th>US$ miliar</th></tr></thead>
      <tbody>${EXPORT_DESTINATIONS_DEC2024.map((d) => `<tr><td>${d.name}</td><td>${fmt(d.value)}</td></tr>`).join('')}</tbody></table>
      <p class="card-note">Nilai bulanan Desember 2024, ekspor nonmigas. Ketiga negara ini menyumbang 44,21% ekspor nonmigas bulan itu.</p>
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
  root.querySelector('#trade-csv').addEventListener('click', () => downloadCSV('perdagangan-indonesia-2021-2024.csv',
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
