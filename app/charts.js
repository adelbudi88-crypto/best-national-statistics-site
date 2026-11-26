// charts.js — small Canvas chart kit, no library.
// drawLineChart / drawBarChart / drawGroupedBars render axes, gridlines,
// value labels and a hover tooltip. Every chart re-renders on window resize.

const INK = '#1c2b3a';
const MUTED = '#6b7a88';
const GRID = '#e3e8ec';

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(280, Math.round(rect.width));
  const h = canvas.dataset.height ? Number(canvas.dataset.height) : 300;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function niceMax(max) {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const step = steps.find((s) => s >= n) ?? 10;
  return step * pow;
}

function axes(ctx, w, h, pad, max, unit) {
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const v = (max * i) / ticks;
    const yy = pad.t + (h - pad.t - pad.b) * (1 - i / ticks);
    ctx.beginPath();
    ctx.moveTo(pad.l, yy);
    ctx.lineTo(w - pad.r, yy);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(v.toLocaleString('id-ID', { maximumFractionDigits: 1 }) + (unit || ''), pad.l - 8, yy + 4);
  }
}

function xLabels(ctx, w, h, pad, labels) {
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  labels.forEach((lab, i) => {
    const x = pad.l + ((w - pad.l - pad.r) * i) / Math.max(1, labels.length - 1 || 1);
    ctx.fillText(String(lab), x, h - 10);
  });
}

function attachTooltip(canvas, points, formatTip) {
  let tip = canvas.parentElement.querySelector('.chart-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.hidden = true;
    canvas.parentElement.style.position = 'relative';
    canvas.parentElement.appendChild(tip);
  }
  canvas.onmousemove = (ev) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    let best = null;
    let bestDist = Infinity;
    for (const p of points) {
      const d = Math.abs(p.x - mx);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    if (!best || bestDist > 40) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.textContent = formatTip(best);
    tip.style.left = Math.min(Math.max(8, best.x - 70), rect.width - 160) + 'px';
    tip.style.top = Math.max(4, best.y - 44) + 'px';
  };
  canvas.onmouseleave = () => { tip.hidden = true; };
}

export function drawLineChart(canvas, opts) {
  if (!canvas || !canvas.isConnected) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 16, r: 16, b: 30, l: 56 };
  const all = opts.series.flatMap((s) => s.values.filter((v) => v != null));
  const max = niceMax(Math.max(...all) * 1.12);
  const min = opts.minZero === false ? Math.min(...all) * 0.92 : 0;
  const labels = opts.labels;
  const xAt = (i) => pad.l + ((w - pad.l - pad.r) * i) / Math.max(1, labels.length - 1);
  const yAt = (v) => pad.t + (h - pad.t - pad.b) * (1 - (v - min) / (max - min));
  axes(ctx, w, h, pad, max, opts.unit);
  xLabels(ctx, w, h, pad, labels);
  const points = [];
  opts.series.forEach((s) => {
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    let started = false;
    s.values.forEach((v, i) => {
      if (v == null) return;
      const x = xAt(i); const y = yAt(v);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      points.push({ x, y, label: labels[i], series: s.name, value: v });
    });
    ctx.stroke();
    ctx.fillStyle = s.color;
    s.values.forEach((v, i) => {
      if (v == null) return;
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = s.color;
    });
    // last value label
    const lastIdx = s.values.length - 1;
    if (s.values[lastIdx] != null) {
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'left';
      ctx.fillText(s.values[lastIdx].toLocaleString('id-ID'), Math.min(xAt(lastIdx) + 8, w - 70), yAt(s.values[lastIdx]) - 8);
    }
  });
  attachTooltip(canvas, points, (p) => `${p.series} · ${p.label}: ${Number(p.value).toLocaleString('id-ID')}${opts.unit || ''}`);
}

export function drawBarChart(canvas, opts) {
  if (!canvas || !canvas.isConnected) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 16, r: 16, b: 30, l: 56 };
  const max = niceMax(Math.max(...opts.values) * 1.15);
  axes(ctx, w, h, pad, max, opts.unit);
  const n = opts.values.length;
  const slot = (w - pad.l - pad.r) / n;
  const barW = Math.min(64, slot * 0.58);
  const points = [];
  opts.values.forEach((v, i) => {
    const x = pad.l + slot * i + (slot - barW) / 2;
    const y = pad.t + (h - pad.t - pad.b) * (1 - v / max);
    const bh = h - pad.b - y;
    ctx.fillStyle = opts.colors ? opts.colors[i % opts.colors.length] : '#0e7490';
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bh, [4, 4, 0, 0]);
    ctx.fill();
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.fillText(v.toLocaleString('id-ID', { maximumFractionDigits: 1 }), x + barW / 2, y - 6);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = MUTED;
    ctx.fillText(String(opts.labels[i]), x + barW / 2, h - 10);
    points.push({ x: x + barW / 2, y, label: opts.labels[i], series: opts.seriesName || '', value: v });
  });
  attachTooltip(canvas, points, (p) => `${p.label}: ${Number(p.value).toLocaleString('id-ID')}${opts.unit || ''}`);
}

export function drawGroupedBars(canvas, opts) {
  if (!canvas || !canvas.isConnected) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 16, r: 16, b: 30, l: 56 };
  const all = opts.series.flatMap((s) => s.values);
  const max = niceMax(Math.max(...all) * 1.15);
  axes(ctx, w, h, pad, max, opts.unit);
  const n = opts.labels.length;
  const slot = (w - pad.l - pad.r) / n;
  const groupW = Math.min(96, slot * 0.72);
  const barW = groupW / opts.series.length;
  const points = [];
  opts.labels.forEach((lab, i) => {
    opts.series.forEach((s, j) => {
      const v = s.values[i];
      const x = pad.l + slot * i + (slot - groupW) / 2 + j * barW;
      const y = pad.t + (h - pad.t - pad.b) * (1 - v / max);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.roundRect(x + 1, y, barW - 2, h - pad.b - y, [3, 3, 0, 0]);
      ctx.fill();
      points.push({ x: x + barW / 2, y, label: lab, series: s.name, value: v });
    });
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'center';
    ctx.fillText(String(lab), pad.l + slot * i + slot / 2, h - 10);
  });
  attachTooltip(canvas, points, (p) => `${p.series} · ${p.label}: ${Number(p.value).toLocaleString('id-ID')}${opts.unit || ''}`);
}

export function drawHorizontalBars(canvas, opts) {
  if (!canvas || !canvas.isConnected) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { t: 8, r: 64, b: 8, l: 110 };
  const max = niceMax(Math.max(...opts.values) * 1.12);
  const n = opts.values.length;
  const slot = (h - pad.t - pad.b) / n;
  const barH = Math.min(30, slot * 0.55);
  opts.values.forEach((v, i) => {
    const y = pad.t + slot * i + (slot - barH) / 2;
    const bw = ((w - pad.l - pad.r) * v) / max;
    ctx.fillStyle = opts.colors ? opts.colors[i % opts.colors.length] : '#0e7490';
    ctx.beginPath();
    ctx.roundRect(pad.l, y, bw, barH, [0, 4, 4, 0]);
    ctx.fill();
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.fillText(String(opts.labels[i]), pad.l - 8, y + barH / 2 + 4);
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(v.toLocaleString('id-ID', { maximumFractionDigits: 2 }) + (opts.unit || ''), pad.l + bw + 8, y + barH / 2 + 4);
  });
}
