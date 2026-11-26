// DataNusa — Statistik Indonesia
// Every figure below was checked against a live public release before it was
// written here. Sources are named next to each series and again on the
// Tentang page. Years are the reference year of the figure, not the year the
// page was built. "—" in a table means the series does not cover that year.

export const YEARS = [2021, 2022, 2023, 2024, 2025];

export const SOURCES = {
  bps: 'Badan Pusat Statistik (BPS)',
  bpsPop: 'BPS, Sensus Penduduk 2010 & 2020, SUPAS 2015, Proyeksi Penduduk 2020–2050',
  bpsGdp: 'BPS, Berita Resmi Statistik 5 Feb 2025 & Pendapatan Nasional Indonesia 2021–2025',
  bpsInflation: 'BPS & Bank Indonesia, Analisis Inflasi Desember 2025',
  bpsLabor: 'BPS, Sakernas Februari 2025 (rilis 5 Mei 2025)',
  bpsPoverty: 'BPS, Susenas Maret 2025 (rilis 25 Jul 2025)',
  bpsHdi: 'BPS, Indeks Pembangunan Manusia 2024 & 2025 (rilis 15 Mei 2025 & 5 Nov 2025)',
  kemenkes: 'Kemenkes RI, Survei Status Gizi Indonesia (SSGI) 2024 (rilis 27 Mei 2025)',
  kemendag: 'Kemendag PDSI, Perkembangan Ekspor–Impor 2024 (data BPS)',
  dukcapil: 'Ditjen Dukcapil Kemendagri, Data Kependudukan Bersih Semester II 2025',
};

// --- Penduduk (juta jiwa). Census / survey points, not a yearly series. ---
export const POPULATION_POINTS = [
  { year: 2010, pop: 237.64, note: 'Sensus Penduduk 2010' },
  { year: 2015, pop: 255.18, note: 'SUPAS 2015' },
  { year: 2020, pop: 270.2, note: 'Sensus Penduduk 2020' },
  { year: 2025, pop: 284.44, note: 'Proyeksi pertengahan tahun' },
];
export const POP_GROWTH = [
  { period: '2010–2015', rate: 1.43 },
  { period: '2015–2020', rate: 1.1 },
  { period: '2020–2025', rate: 1.08 },
];
export const POP_FACTS = {
  genZShare: 24.93,
  productiveShare: 69.3,
  productiveMillions: 196,
  medianProvince: 3.78,
  smallestProvince: { name: 'Papua Selatan', pop: 0.55 },
};
// Lima provinsi terpadat, Dukcapil Semester II 2025 (juta jiwa).
export const TOP_PROVINCES = [
  { name: 'Jawa Barat', pop: 51.16, share: 17.7 },
  { name: 'Jawa Timur', pop: 42.35, share: 14.7 },
  { name: 'Jawa Tengah', pop: 38.56, share: 13.4 },
  { name: 'Sumatera Utara', pop: 15.98, share: 5.5 },
  { name: 'Banten', pop: 12.64, share: 4.4 },
];
export const DUKCAPIL_TOTAL = 288.32;

// --- Ekonomi ---
export const GDP = {
  nominal: [
    { year: 2021, value: 16977 },
    { year: 2022, value: 19588.5 },
    { year: 2023, value: 20892.3 },
    { year: 2024, value: 22139.0 },
    { year: 2025, value: 23821.1 },
  ],
  growth: [
    { year: 2021, value: 3.7 },
    { year: 2022, value: 5.31 },
    { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 },
    { year: 2025, value: 5.11 },
  ],
  perCapita: [
    { year: 2024, rupiahJt: 78.6, usd: 4960 },
    { year: 2025, rupiahJt: 83.7, usd: null },
  ],
};

// --- Harga & inflasi (yoy Desember, %) ---
export const INFLATION = [
  { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
  { year: 2025, value: 2.92 },
];
export const INFLATION_COMPONENTS_DEC2025 = [
  { name: 'Inflasi inti', value: 2.38, note: 'Perhiasan emas & minyak goreng penyumbang terbesar' },
  { name: 'Volatile food', value: 6.21, note: 'Cabai merah, cabai rawit, daging ayam ras' },
  { name: 'Administered prices', value: 1.93, note: 'BBM non-subsidi & tarif angkutan' },
];
export const INFLATION_TARGET = '2,5% ± 1%';

// --- Ketenagakerjaan (Sakernas Februari) ---
export const TPT = [
  { year: 2021, value: 6.26 },
  { year: 2022, value: 5.83 },
  { year: 2023, value: 5.45 },
  { year: 2024, value: 4.82 },
  { year: 2025, value: 4.76 },
];
export const LABOR_FEB2025 = { laborForce: 153.05, unemployed: 7.28, employed: 145.77 };
export const TPT_PROVINCES = [
  { name: 'Papua', value: 6.92 },
  { name: 'DKI Jakarta', value: 6.18 },
  { name: 'Nasional', value: 4.76 },
];

// --- Kemiskinan (Susenas Maret, %) ---
export const POVERTY = [
  { year: 2021, value: 10.14 },
  { year: 2022, value: 9.54 },
  { year: 2023, value: 9.36 },
  { year: 2024, value: 9.03 },
  { year: 2025, value: 8.47 },
];
export const POVERTY_MAR2025 = {
  poorMillions: 23.85, line: 609160, urban: 6.73, rural: 11.03, extreme: 0.85,
};

// --- Pendidikan & pembangunan manusia ---
export const IPM = [
  { year: 2022, value: 73.77 },
  { year: 2023, value: 74.39 },
  { year: 2024, value: 75.02 },
  { year: 2025, value: 75.9 },
];
export const IPM_COMPONENTS = {
  2024: { uhh: 74.15, hls: 13.21, rls: 8.85 },
  2025: { uhh: 74.47, hls: 13.3, rls: 9.07 },
};

// --- Kesehatan ---
export const STUNTING = [
  { year: 2019, value: 27.7 },
  { year: 2021, value: 24.4 },
  { year: 2022, value: 21.6 },
  { year: 2023, value: 21.5 },
  { year: 2024, value: 19.8 },
];
export const CHILD_NUTRITION = [
  { name: 'Stunting', y2013: 37.6, y2024: 19.8 },
  { name: 'Wasting', y2013: 12.1, y2024: 7.4 },
  { name: 'Overweight', y2013: 11.8, y2024: 3.4 },
];
export const STUNTING_COUNT_2024 = 4.48;

// --- Perdagangan luar negeri (US$ miliar) ---
export const TRADE = [
  { year: 2021, exports: 231.61, imports: 196.27, surplus: 35.34 },
  { year: 2022, exports: 291.9, imports: 237.44, surplus: 54.46 },
  { year: 2023, exports: 258.82, imports: 221.93, surplus: 36.89 },
  { year: 2024, exports: 264.7, imports: 233.66, surplus: 31.04 },
];
export const EXPORT_DESTINATIONS_DEC2024 = [
  { name: 'Tiongkok', value: 5.79 },
  { name: 'Amerika Serikat', value: 2.46 },
  { name: 'Jepang', value: 1.45 },
];

// --- Rilis resmi terbaru yang dipakai situs ini ---
export const RELEASES = [
  { date: '5 Nov 2025', title: 'IPM 2025 mencapai 75,90 — kategori tinggi', source: 'BPS' },
  { date: '25 Jul 2025', title: 'Kemiskinan Maret 2025: 8,47% atau 23,85 juta jiwa', source: 'BPS' },
  { date: '27 Mei 2025', title: 'Stunting 2024 turun ke 19,8% (SSGI)', source: 'Kemenkes' },
  { date: '5 Mei 2025', title: 'TPT Februari 2025: 4,76%, terendah sejak 1995', source: 'BPS' },
  { date: '5 Feb 2025', title: 'Ekonomi 2024 tumbuh 5,03%; PDB Rp22.139 triliun', source: 'BPS' },
  { date: '2 Jan 2025', title: 'Inflasi 2024: 1,57% (yoy)', source: 'BPS' },
  { date: '15 Jan 2025', title: 'Neraca dagang 2024 surplus US$31,04 miliar', source: 'BPS / Kemendag' },
];

// --- Master table: one row per year, null = series does not cover the year ---
export const MASTER_ROWS = YEARS.map((y) => {
  const pick = (arr) => { const f = arr.find((d) => d.year === y); return f ? f.value : null; };
  const gdp = GDP.nominal.find((d) => d.year === y);
  const tr = TRADE.find((d) => d.year === y);
  const ipm = IPM.find((d) => d.year === y);
  return {
    year: y,
    population: y === 2025 ? 284.44 : null,
    gdpNominal: gdp ? gdp.value : null,
    gdpGrowth: pick(GDP.growth),
    inflation: pick(INFLATION),
    tpt: pick(TPT),
    poverty: pick(POVERTY),
    ipm: ipm ? ipm.value : null,
    exports: tr ? tr.exports : null,
    imports: tr ? tr.imports : null,
    surplus: tr ? tr.surplus : null,
  };
});

export const MASTER_COLUMNS = [
  { key: 'year', label: 'Tahun', format: (v) => String(v) },
  { key: 'population', label: 'Penduduk (juta)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'gdpNominal', label: 'PDB nominal (Rp triliun)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { maximumFractionDigits: 1 })) },
  { key: 'gdpGrowth', label: 'Pertumbuhan ekonomi (%)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'inflation', label: 'Inflasi yoy (%)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'tpt', label: 'TPT Feb (%)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'poverty', label: 'Kemiskinan Mar (%)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'ipm', label: 'IPM', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'exports', label: 'Ekspor (US$ miliar)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'imports', label: 'Impor (US$ miliar)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
  { key: 'surplus', label: 'Surplus dagang (US$ miliar)', format: (v) => (v == null ? '—' : v.toLocaleString('id-ID', { minimumFractionDigits: 2 })) },
];

// --- Search index: every indicator the header search can find ---
export const SEARCH_INDEX = [
  { term: 'Penduduk', value: '284,44 juta jiwa (2025)', route: '#/penduduk' },
  { term: 'Pertumbuhan penduduk', value: '1,08% per tahun (2020–2025)', route: '#/penduduk' },
  { term: 'Generasi Z', value: '24,93% dari penduduk (2025)', route: '#/penduduk' },
  { term: 'Jawa Barat', value: '51,16 juta jiwa — provinsi terpadat', route: '#/penduduk' },
  { term: 'Jawa Timur', value: '42,35 juta jiwa', route: '#/penduduk' },
  { term: 'Jawa Tengah', value: '38,56 juta jiwa', route: '#/penduduk' },
  { term: 'PDB', value: 'Rp23.821,1 triliun (2025)', route: '#/ekonomi' },
  { term: 'Pertumbuhan ekonomi', value: '5,11% (2025)', route: '#/ekonomi' },
  { term: 'PDB per kapita', value: 'Rp83,7 juta (2025)', route: '#/ekonomi' },
  { term: 'Inflasi', value: '2,92% yoy (Desember 2025)', route: '#/harga' },
  { term: 'Inflasi inti', value: '2,38% (Desember 2025)', route: '#/harga' },
  { term: 'Volatile food', value: '6,21% (Desember 2025)', route: '#/harga' },
  { term: 'Pengangguran (TPT)', value: '4,76% (Februari 2025)', route: '#/kerja' },
  { term: 'Angkatan kerja', value: '153,05 juta orang (Februari 2025)', route: '#/kerja' },
  { term: 'Kemiskinan', value: '8,47% — 23,85 juta jiwa (Maret 2025)', route: '#/kerja' },
  { term: 'Garis kemiskinan', value: 'Rp609.160 per kapita per bulan', route: '#/kerja' },
  { term: 'IPM', value: '75,90 (2025)', route: '#/pendidikan' },
  { term: 'Harapan hidup', value: '74,47 tahun (2025)', route: '#/pendidikan' },
  { term: 'Harapan lama sekolah', value: '13,30 tahun (2025)', route: '#/pendidikan' },
  { term: 'Rata-rata lama sekolah', value: '9,07 tahun (2025)', route: '#/pendidikan' },
  { term: 'Stunting', value: '19,8% balita (2024)', route: '#/kesehatan' },
  { term: 'Wasting', value: '7,4% balita (2024)', route: '#/kesehatan' },
  { term: 'Ekspor', value: 'US$264,70 miliar (2024)', route: '#/perdagangan' },
  { term: 'Impor', value: 'US$233,66 miliar (2024)', route: '#/perdagangan' },
  { term: 'Surplus perdagangan', value: 'US$31,04 miliar (2024)', route: '#/perdagangan' },
  { term: 'Tiongkok', value: 'Tujuan ekspor terbesar, US$5,79 miliar (Des 2024)', route: '#/perdagangan' },
];
