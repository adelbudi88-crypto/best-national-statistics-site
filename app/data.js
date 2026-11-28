// DataNusa — Statistik Indonesia
// Every figure below was checked against a live public release before it was
// written here. Sources are named next to each series and again on the
// Tentang page. Years are the reference year of the figure, not the year the
// page was built. "—" in a table means the series does not cover that year.
// v3 (28 Nov 2026): IPM memakai seri revisi BPS (publikasi IPM 2025,
// Apr 2026) — 2021 73,16, bukan 72,29 dari seri lama; penduduk 2021–2024
// terisi dari proyeksi pertengahan tahun BPS sehingga tabel master tidak
// lagi punya sel kosong; ditambah seri 10 tahun 2016–2025 dan data 38
// provinsi (penduduk 2024, IPM 2025, UMP 2025) untuk peta + tabel beranda.

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
  bpsTrade2025: 'BPS, Berita Resmi Statistik 2 Feb 2026 (neraca perdagangan 2025)',
  bpsSectors2025: 'BPS, Berita Resmi Statistik 5 Feb 2026 & Pendapatan Nasional Indonesia 2021–2025',
  bpsPdrbProv: 'BPS, PDRB Provinsi menurut Lapangan Usaha 2021–2025 (rilis 13 Apr 2026; angka 2025 sangat sementara)',
  bpsIpmProv: 'BPS, Indeks Pembangunan Manusia 2025 (rilis 5 Nov 2025)',
  bpsPyramid: 'BPS, Jumlah Penduduk menurut Kelompok Umur dan Jenis Kelamin 2025 (diperbarui 9 Mei 2025)',
  bpsPop2024: 'BPS, Proyeksi Penduduk Interim 2020–2023 (pertengahan tahun 2024)',
  bpsIpmProv2025: 'BPS, Indeks Pembangunan Manusia 2025 (rilis 5 Nov 2025)',
  kemnakerUmp2025: 'Kemnaker, Permenaker 16/2024 & SK Gubernur 38 provinsi — UMP 2025',
  kemnakerUmp: 'Kemnaker (Satudata) & SK Gubernur 38 provinsi, PP 49/2025 — UMP 2026',
  biKurs: 'Bank Indonesia, Kurs Transaksi 26 Nov 2026',
  bpsRice: 'BPS, harga beras minggu ke-3 November 2026 (Rakor Pengendalian Inflasi Daerah, 23 Nov 2026)',
  pertamina: 'Pertamina Patra Niaga, daftar harga BBM berlaku sejak 2 Sep 2026 (wilayah Jawa)',
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
// --- Penduduk pertengahan tahun (juta jiwa), BPS proyeksi ---
// 2021–2024: proyeksi interim BPS; 2025: proyeksi pertengahan tahun.
export const POPULATION_SERIES = [
  { year: 2021, pop: 272.68 },
  { year: 2022, pop: 275.77 },
  { year: 2023, pop: 278.7 },
  { year: 2024, pop: 281.6 },
  { year: 2025, pop: 284.44 },
];
// --- Seri 10 tahun, 2016–2025 (untuk chart "10 tahun dalam 1 grafik") ---
// Penduduk: BPS proyeksi pertengahan tahun (2020 sensus). PDB nominal:
// BPS, Pendapatan Nasional Indonesia (Rp triliun). Inflasi: BPS, yoy
// Desember (%). Ekspor: BPS, Berita Resmi Statistik (US$ miliar).
export const TEN_YEAR = {
  years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  population: [258.71, 261.36, 264.01, 266.91, 270.2, 272.68, 275.77, 278.7, 281.6, 284.44],
  gdp: [12401.7, 13589.8, 14838.7, 15832.6, 15443.4, 16977, 19588.5, 20892.3, 22139, 23821.1],
  inflation: [3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.92],
  exports: [144.49, 168.83, 180.22, 167.68, 163.19, 231.61, 291.9, 258.82, 266.53, 282.91],
};
// --- 38 provinsi: penduduk 2024, IPM 2025, UMP 2025 ---
// Penduduk (juta): BPS, Proyeksi Penduduk Interim 2020–2023,
// pertengahan tahun 2024 (total nasional 281,60 juta). IPM: BPS, IPM
// 2025 (rilis 5 Nov 2025). UMP (Rp/bulan): Kemnaker, Permenaker 16/2024
// & SK Gubernur; empat provinsi Papua (Papua, Papua Tengah, Papua
// Selatan, Papua Pegunungan) memakai UMP yang sama, Rp4.285.847.
export const PROVINCES_38 = [
  { name: 'Aceh', island: 'Sumatera', pop2024: 5.55, ipm2025: 76.23, ump2025: 3685616 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop2024: 15.59, ipm2025: 76.47, ump2025: 2992559 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop2024: 5.84, ipm2025: 77.27, ump2025: 2994246 },
  { name: 'Riau', island: 'Sumatera', pop2024: 6.73, ipm2025: 76.31, ump2025: 3508775 },
  { name: 'Jambi', island: 'Sumatera', pop2024: 3.72, ipm2025: 75.13, ump2025: 3234533 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop2024: 8.84, ipm2025: 74.76, ump2025: 3681570 },
  { name: 'Bengkulu', island: 'Sumatera', pop2024: 2.11, ipm2025: 75.68, ump2025: 2670039 },
  { name: 'Lampung', island: 'Sumatera', pop2024: 9.42, ipm2025: 73.98, ump2025: 2893086 },
  { name: 'Kepulauan Bangka Belitung', island: 'Sumatera', pop2024: 1.53, ipm2025: 75.26, ump2025: 3876600 },
  { name: 'Kepulauan Riau', island: 'Sumatera', pop2024: 2.18, ipm2025: 80.53, ump2025: 3623653 },
  { name: 'DKI Jakarta', island: 'Jawa', pop2024: 10.68, ipm2025: 85.05, ump2025: 5396760 },
  { name: 'Jawa Barat', island: 'Jawa', pop2024: 50.35, ipm2025: 75.9, ump2025: 2191232 },
  { name: 'Jawa Tengah', island: 'Jawa', pop2024: 37.89, ipm2025: 74.77, ump2025: 2169348 },
  { name: 'DI Yogyakarta', island: 'Jawa', pop2024: 3.76, ipm2025: 82.48, ump2025: 2264080 },
  { name: 'Jawa Timur', island: 'Jawa', pop2024: 41.81, ipm2025: 76.13, ump2025: 2305985 },
  { name: 'Banten', island: 'Jawa', pop2024: 12.43, ipm2025: 77.25, ump2025: 2905119 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', pop2024: 4.43, ipm2025: 79.37, ump2025: 2996560 },
  { name: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', pop2024: 5.65, ipm2025: 73.97, ump2025: 2602931 },
  { name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', pop2024: 5.66, ipm2025: 69.89, ump2025: 2328969 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop2024: 5.7, ipm2025: 72.09, ump2025: 2878286 },
  { name: 'Kalimantan Tengah', island: 'Kalimantan', pop2024: 2.81, ipm2025: 74.86, ump2025: 3473621 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop2024: 4.27, ipm2025: 76.1, ump2025: 3496194 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', pop2024: 4.05, ipm2025: 79.39, ump2025: 3579313 },
  { name: 'Kalimantan Utara', island: 'Kalimantan', pop2024: 0.74, ipm2025: 74.04, ump2025: 3580160 },
  { name: 'Sulawesi Utara', island: 'Sulawesi', pop2024: 2.7, ipm2025: 76.32, ump2025: 3775425 },
  { name: 'Sulawesi Tengah', island: 'Sulawesi', pop2024: 3.12, ipm2025: 72.82, ump2025: 2914583 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop2024: 9.46, ipm2025: 75.92, ump2025: 3657527 },
  { name: 'Sulawesi Tenggara', island: 'Sulawesi', pop2024: 2.79, ipm2025: 74.25, ump2025: 3073552 },
  { name: 'Gorontalo', island: 'Sulawesi', pop2024: 1.23, ipm2025: 72.62, ump2025: 3221731 },
  { name: 'Sulawesi Barat', island: 'Sulawesi', pop2024: 1.5, ipm2025: 71.16, ump2025: 3104430 },
  { name: 'Maluku', island: 'Maluku', pop2024: 1.95, ipm2025: 74.09, ump2025: 3141699 },
  { name: 'Maluku Utara', island: 'Maluku', pop2024: 1.36, ipm2025: 72.52, ump2025: 3408000 },
  { name: 'Papua', island: 'Papua', pop2024: 1.06, ipm2025: 74.69, ump2025: 4285847 },
  { name: 'Papua Barat', island: 'Papua', pop2024: 0.58, ipm2025: 68.48, ump2025: 3613545 },
  { name: 'Papua Selatan', island: 'Papua', pop2024: 0.54, ipm2025: 69.54, ump2025: 4285847 },
  { name: 'Papua Tengah', island: 'Papua', pop2024: 1.47, ipm2025: 60.64, ump2025: 4285847 },
  { name: 'Papua Pegunungan', island: 'Papua', pop2024: 1.47, ipm2025: 54.91, ump2025: 4285847 },
  { name: 'Papua Barat Daya', island: 'Papua', pop2024: 0.63, ipm2025: 70.55, ump2025: 3614077 },
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

// --- Piramida penduduk 2025 (juta jiwa), BPS age–sex projection table ---
// Laki-laki 143,548 juta; perempuan 140,891 juta; total 284,439 juta.
// Broad groups: 0–14 tahun 23,5%, 15–64 tahun 69,0%, 65+ tahun 7,6%.
export const PYRAMID_2025 = [
  { group: '0–4', male: 11.606, female: 11.146 },
  { group: '5–9', male: 11.225, female: 10.73 },
  { group: '10–14', male: 11.25, female: 10.766 },
  { group: '15–19', male: 11.389, female: 10.706 },
  { group: '20–24', male: 11.401, female: 10.76 },
  { group: '25–29', male: 11.532, female: 10.982 },
  { group: '30–34', male: 11.324, female: 10.871 },
  { group: '35–39', male: 11.013, female: 10.705 },
  { group: '40–44', male: 10.436, female: 10.247 },
  { group: '45–49', male: 9.84, female: 9.795 },
  { group: '50–54', male: 8.775, female: 8.825 },
  { group: '55–59', male: 7.518, female: 7.652 },
  { group: '60–64', male: 6.074, female: 6.287 },
  { group: '65–69', male: 4.519, female: 4.749 },
  { group: '70–74', male: 3.036, female: 3.308 },
  { group: '75+', male: 2.609, female: 3.363 },
];
export const PYRAMID_TOTALS = { male: 143.548, female: 140.891, sexRatio: 101.9 };
export const AGE_BROAD = [
  { group: '0–14 tahun', share: 23.5, millions: 66.72 },
  { group: '15–64 tahun', share: 69.0, millions: 196.13 },
  { group: '65+ tahun', share: 7.6, millions: 21.58 },
];

// --- Sepuluh provinsi terpadat, 2025 ---
// Penduduk: BPS proyeksi 2026 (lima teratas sama dengan Dukcapil Sem II 2025
// yang dipakai v1, kecuali Sumatera Utara 15,98 juta menurut Dukcapil).
// PDRB per kapita: BPS PDRB Provinsi 2021–2025 (angka 2025 sangat sementara).
// IPM: BPS IPM 2025 (rilis 5 Nov 2025).
export const TOP10_PROVINCES = [
  { name: 'Jawa Barat', pop: 51.16, pdrbPerCapita: 59.87, ipm: 75.9 },
  { name: 'Jawa Timur', pop: 42.35, pdrbPerCapita: 80.86, ipm: 76.13 },
  { name: 'Jawa Tengah', pop: 38.56, pdrbPerCapita: 50.82, ipm: 74.77 },
  { name: 'Sumatera Utara', pop: 15.98, pdrbPerCapita: 78.31, ipm: 76.47 },
  { name: 'Banten', pop: 12.64, pdrbPerCapita: 74.67, ipm: 77.25 },
  { name: 'DKI Jakarta', pop: 10.67, pdrbPerCapita: 367.69, ipm: 85.05 },
  { name: 'Sulawesi Selatan', pop: 9.66, pdrbPerCapita: 78.75, ipm: 75.92 },
  { name: 'Lampung', pop: 9.1, pdrbPerCapita: 55.01, ipm: 73.98 },
  { name: 'Sumatera Selatan', pop: 8.99, pdrbPerCapita: 80.66, ipm: 74.76 },
  { name: 'Riau', pop: 7.3, pdrbPerCapita: 176.39, ipm: 76.31 },
];

// --- Upah minimum provinsi (rata-rata 38 provinsi) ---
// 2026: Rp3.508.714/bulan, naik 5,91% dari 2025 (Rp3,31 juta).
// Tertinggi DKI Jakarta Rp5.729.876; terendah Jawa Barat Rp2.317.601.
export const UMP = {
  avg2025: 3.31, avg2026: 3.51, risePct: 5.91,
  highest: { name: 'DKI Jakarta', value: 5729876 },
  lowest: { name: 'Jawa Barat', value: 2317601 },
  series: [
    { year: 2025, value: 3.31 },
    { year: 2026, value: 3.51 },
  ],
};

// --- Angka hari ini — Kamis, 26 November 2026 ---
export const TODAY_PRICES = {
  date: 'Kamis, 26 November 2026',
  usdBuy: 18211.49, usdSell: 18394.51, usdSpot: 18401, usdClose: 18335,
  riceMedium: 14670, ricePremium: 16548,
  pertalite: 10000, pertamax: 15950,
};

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
    { year: 2025, rupiahJt: 83.7, usd: 5083 },
  ],
};

// --- PDB menurut lapangan usaha, 2025 (harga berlaku) ---
// Lima lapangan usaha terbesar menyumbang 63,92% PDB. Pertumbuhan c-to-c
// 2025: industri 5,30%, perdagangan 5,49%, pertanian 5,33%, pertambangan
// −0,66% (satu-satunya yang terkontraksi).
export const GDP_SECTORS_2025 = [
  { name: 'Industri pengolahan', value: 4541.5, share: 19.07, growth: 5.3 },
  { name: 'Perdagangan besar & eceran', value: 3136.6, share: 13.17, growth: 5.49 },
  { name: 'Pertanian, kehutanan & perikanan', value: 3120.5, share: 13.1, growth: 5.33 },
  { name: 'Konstruksi', value: 2340.9, share: 9.83, growth: null },
  { name: 'Pertambangan & penggalian', value: 2084.6, share: 8.75, growth: -0.66 },
];

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
// Seri REVISI BPS (publikasi IPM 2025, Apr 2026): 2020 72,81; 2021 73,16;
// 2022 73,77; 2023 74,39; 2024 75,02; 2025 75,90. Angka 72,29/72,91 yang
// beredar adalah seri lama sebelum revisi dan TIDAK dipakai di sini.
export const IPM = [
  { year: 2021, value: 73.16 },
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
// 2024 direvisi BPS pada rilis 2 Feb 2026 (sebelumnya 264,70 / 233,66 /
// 31,04). 2025: ekspor +6,15%, impor +2,83% dibanding 2024; surplus
// nonmigas US$60,75 miliar, migas defisit US$19,70 miliar.
export const TRADE = [
  { year: 2021, exports: 231.61, imports: 196.27, surplus: 35.34 },
  { year: 2022, exports: 291.9, imports: 237.44, surplus: 54.46 },
  { year: 2023, exports: 258.82, imports: 221.93, surplus: 36.89 },
  { year: 2024, exports: 266.53, imports: 235.2, surplus: 31.33 },
  { year: 2025, exports: 282.91, imports: 241.86, surplus: 41.05 },
];
export const EXPORT_DESTINATIONS_2025 = [
  { name: 'Tiongkok', value: 64.82 },
  { name: 'Amerika Serikat', value: 30.96 },
  { name: 'India', value: 18.32 },
];
// Golongan HS 2 digit, ekspor 2025. Di dalam HS 27: batu bara US$24,48 miliar
// (−19,7%) dan di dalam HS 15: minyak sawit & turunannya US$24,42 miliar (+21,8%).
export const EXPORT_TOP_2025 = [
  { name: 'Bahan bakar mineral & minyak (HS 27)', value: 45.11, share: 16.0 },
  { name: 'Minyak hewani & nabati — sawit (HS 15)', value: 34.36, share: 12.2 },
  { name: 'Besi & baja (HS 72)', value: 27.97, share: 9.9 },
  { name: 'Mesin & peralatan listrik (HS 85)', value: 19.19, share: 6.8 },
  { name: 'Kendaraan & bagiannya (HS 87)', value: 12.18, share: 4.3 },
];
// Impor 2025: tiga kategori terbesar saja sudah >43% total impor. Kategori
// ke-4 dan ke-5 tidak dicantumkan karena agregat yang beredar bertentangan
// (besi & baja impor: US$10,7 miliar vs US$17,5 miliar menurut dua olahan berbeda).
export const IMPORT_TOP_2025 = [
  { name: 'Mesin & peralatan mekanis (HS 84)', value: 36.17, share: 15.06 },
  { name: 'Bahan bakar mineral & minyak (HS 27)', value: 35.97, share: 14.98 },
  { name: 'Mesin & peralatan listrik (HS 85)', value: 31.88, share: 13.27 },
];

// --- Rilis resmi terbaru yang dipakai situs ini ---
export const RELEASES = [
  { date: '5 Feb 2026', title: 'Ekonomi 2025 tumbuh 5,11%; PDB Rp23.821,1 triliun', source: 'BPS' },
  { date: '2 Feb 2026', title: 'Neraca dagang 2025 surplus US$41,05 miliar — rekor', source: 'BPS' },
  { date: '5 Nov 2025', title: 'IPM 2025 mencapai 75,90 — kategori tinggi', source: 'BPS' },
  { date: '25 Jul 2025', title: 'Kemiskinan Maret 2025: 8,47% atau 23,85 juta jiwa', source: 'BPS' },
  { date: '27 Mei 2025', title: 'Stunting 2024 turun ke 19,8% (SSGI)', source: 'Kemenkes' },
  { date: '5 Mei 2025', title: 'TPT Februari 2025: 4,76%, terendah sejak 1995', source: 'BPS' },
  { date: '5 Feb 2025', title: 'Ekonomi 2024 tumbuh 5,03%; PDB Rp22.139 triliun', source: 'BPS' },
];

// --- Master table: one row per year, null = series does not cover the year ---
export const MASTER_ROWS = YEARS.map((y) => {
  const pick = (arr) => { const f = arr.find((d) => d.year === y); return f ? f.value : null; };
  const gdp = GDP.nominal.find((d) => d.year === y);
  const tr = TRADE.find((d) => d.year === y);
  const ipm = IPM.find((d) => d.year === y);
  return {
    year: y,
    population: POPULATION_SERIES.find((d) => d.year === y)?.pop ?? null,
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
  { term: 'Ekspor', value: 'US$282,91 miliar (2025)', route: '#/perdagangan' },
  { term: 'Impor', value: 'US$241,86 miliar (2025)', route: '#/perdagangan' },
  { term: 'Surplus perdagangan', value: 'US$41,05 miliar (2025)', route: '#/perdagangan' },
  { term: 'Tiongkok', value: 'Tujuan ekspor terbesar, US$64,82 miliar (2025)', route: '#/perdagangan' },
  { term: 'UMP', value: 'Rata-rata Rp3,51 juta/bulan (2026)', route: '#/kerja' },
  { term: 'Upah minimum', value: 'Tertinggi DKI Jakarta Rp5,73 juta (2026)', route: '#/kerja' },
  { term: 'Kurs dolar', value: 'Rp18.211–18.395 (BI, 26 Nov 2026)', route: '#/' },
  { term: 'Beras', value: 'Medium Rp14.670/kg (BPS, Nov 2026)', route: '#/' },
  { term: 'Piramida penduduk', value: 'Laki-laki 143,55 jt · perempuan 140,89 jt (2025)', route: '#/penduduk' },
  { term: 'Batu bara', value: 'Ekspor US$24,48 miliar (2025)', route: '#/ekonomi' },
  { term: 'Sawit', value: 'Ekspor minyak sawit US$24,42 miliar (2025)', route: '#/ekonomi' },
];
