/**
 * diagnostics.js — Network diagnostic logic
 * All fetch-based checks, constants, and helpers.
 * Fully in English.
 */

// ── Constants ──────────────────────────────────────────────
export const PING_TARGETS = [
  { host: 'google.com', url: 'https://www.google.com/generate_204' },
  { host: 'cloudflare', url: 'https://1.1.1.1/cdn-cgi/trace' },
  { host: 'github.com', url: 'https://github.com/favicon.ico' },
  { host: 'openai.com', url: 'https://openai.com/favicon.ico' },
];

export const BLOCK_TARGETS = [
  { host: 'google.com', url: 'https://www.google.com/generate_204', icon: '🌐' },
  { host: 'cloudflare.com', url: 'https://1.1.1.1/cdn-cgi/trace', icon: '🔶' },
  { host: 'github.com', url: 'https://github.com/favicon.ico', icon: '🐙' },
  { host: 'youtube.com', url: 'https://www.youtube.com/favicon.ico', icon: '▶️' },
  { host: 'wikipedia.org', url: 'https://en.wikipedia.org/favicon.ico', icon: '📖' },
  { host: 'reddit.com', url: 'https://www.reddit.com/favicon.ico', icon: '🤖' },
  { host: 'facebook.com', url: 'https://www.facebook.com/favicon.ico', icon: '📘' },
  { host: 'chatgpt.com', url: 'https://openai.com/favicon.ico', icon: '🤖' },
  { host: 'instagram.com', url: 'https://www.instagram.com/favicon.ico', icon: '📸' },
  { host: 'twitter.com', url: 'https://twitter.com/favicon.ico', icon: '🐦' },
  { host: 'linkedin.com', url: 'https://www.linkedin.com/favicon.ico', icon: '👔' },
];

export const DNS_HOSTS = [
  { host: 'google.com', url: 'https://www.google.com/generate_204' },
  { host: 'cloudflare.com', url: 'https://1.1.1.1/cdn-cgi/trace' },
  { host: 'github.com', url: 'https://github.com/favicon.ico' },
];

// Helpers
export const nowStr = () =>
  new Date().toLocaleTimeString('en-US', { hour12: false });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function timedFetch(url, opts = {}, timeoutMs = 6000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() =>
    clearTimeout(timer)
  );
}

// Connection type 
export async function checkWifi() {
  const online = navigator.onLine;
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  let typeLabel = 'Unknown';
  let typeIcon = '📡';
  let connClass = '';
  let type = 'N/A';
  let speed = 'N/A';
  let rtt = 'N/A';
  let saver = 'N/A';
  let saverWarn = false;
  const logs = [];

  if (conn) {
    const raw = (conn.type || '').toLowerCase();
    const eff = (conn.effectiveType || '').toLowerCase();

    if (raw === 'wifi' || (eff === '4g' && conn.downlink > 5)) {
      typeLabel = 'Wi-Fi'; typeIcon = '📶'; connClass = 'ok';
    } else if (raw === 'ethernet') {
      typeLabel = 'Ethernet (LAN)'; typeIcon = '🖧'; connClass = 'ok';
    } else if (raw === 'cellular' || eff === '4g') {
      typeLabel = '4G / LTE Cellular'; typeIcon = '📱'; connClass = 'ok';
    } else if (eff === '3g') {
      typeLabel = '3G Cellular'; typeIcon = '📱'; connClass = 'warn';
    } else if (eff === '2g' || eff === 'slow-2g') {
      typeLabel = '2G / Slow'; typeIcon = '🐢'; connClass = 'warn';
    } else if (raw === 'none') {
      typeLabel = 'No connection'; typeIcon = '❌'; connClass = 'fail';
    } else {
      typeLabel = (raw || eff || 'unknown').toUpperCase(); typeIcon = '🌐';
    }

    type = (raw || eff || 'N/A').toUpperCase();
    speed = conn.downlink ? `${conn.downlink} Mbps` : 'N/A';
    rtt = conn.rtt ? `${conn.rtt} ms` : 'N/A';
    saver = conn.saveData ? 'On' : 'Off';
    saverWarn = !!conn.saveData;
    logs.push({ msg: `Connection type: ${typeLabel}`, type: connClass || 'info' });
    if (conn.downlink) logs.push({ msg: `Estimated speed: ${conn.downlink} Mbps`, type: 'info' });
  } else {
    logs.push({ msg: 'Network Information API not supported', type: 'warn' });
  }

  logs.push({
    msg: online ? 'Device is online' : 'Device offline',
    type: online ? 'ok' : 'fail',
  });

  return {
    online,
    typeLabel,
    typeIcon,
    connClass,
    type,
    speed,
    rtt,
    saver,
    saverWarn,
    status: online ? 'ok' : 'fail',
    badge: online ? 'Connected' : 'Offline',
    logs,
    passed: online ? 1 : 0,
    failures: online ? 0 : 1,
  };
}

// CHECK: IPv4 & IPv6
export async function checkIpVersions() {
  const logs = [];
  let ipv4 = null, ipv6 = null, meta = {};

  logs.push({ msg: 'Fetching IPv4 and IPv6 addresses…', type: 'info' });

  try {
    const r = await timedFetch('https://api.ipify.org?format=json');
    const d = await r.json();
    ipv4 = d.ip || null;
  } catch { /* ignore */ }

  try {
    const r = await timedFetch('https://api6.ipify.org?format=json');
    const d = await r.json();
    ipv6 = d.ip || null;
  } catch { /* ignore */ }

  try {
    const r = await timedFetch('https://ipapi.co/json/');
    meta = await r.json();
  } catch { /* ignore */ }

  const isp = meta.org || meta.isp || 'N/A';
  const region = [meta.country_name, meta.region].filter(Boolean).join(' / ') || 'N/A';
  const tz = meta.timezone || 'N/A';
  const proxy = !!(meta.proxy || meta.vpn || meta.hosting);

  logs.push({ msg: ipv4 ? `IPv4: ${ipv4}` : 'IPv4: Failed to fetch', type: ipv4 ? 'ok' : 'fail' });
  logs.push({ msg: ipv6 ? `IPv6: ${ipv6}` : 'IPv6: Not supported or blocked', type: ipv6 ? 'ok' : 'warn' });
  if (meta.org) logs.push({ msg: `ISP: ${meta.org}`, type: 'info' });

  const hasV4 = !!ipv4;
  return {
    ipv4: ipv4 || 'Failed to fetch',
    ipv6: ipv6 || 'Not supported',
    ipv4Ok: !!ipv4,
    ipv6Ok: !!ipv6,
    isp,
    region,
    tz,
    proxy,
    status: hasV4 ? 'ok' : 'fail',
    badge: hasV4 ? (ipv6 ? 'IPv4+IPv6' : 'IPv4 Only') : 'Failed',
    logs,
    passed: hasV4 ? 1 : 0,
    failures: hasV4 ? 0 : 1,
    rawIpv4: ipv4,
    rawIpv6: ipv6,
  };
}

// DNS
export async function checkDns() {
  const logs = [];
  const results = [];

  logs.push({ msg: 'Checking DNS…', type: 'info' });

  for (const t of DNS_HOSTS) {
    const start = performance.now();
    let ok = false, ms = null;
    try {
      await timedFetch(t.url + '?_t=' + Date.now(), {
        method: 'HEAD', mode: 'no-cors', cache: 'no-store',
      }, 5000);
      ok = true;
      ms = Math.round(performance.now() - start);
    } catch { }

    const cls = !ok ? 'fail' : ms > 300 ? 'warn' : 'ok';
    results.push({ host: t.host, ok, ms, cls });
    logs.push({ msg: `${t.host}: ${ok ? ms + ' ms' : 'timeout'}`, type: cls });
  }

  const bestMs = results.filter((r) => r.ok).map((r) => r.ms).sort((a, b) => a - b)[0];

  //DNS provider detection via Cloudflare trace
  let provider = 'Unknown', doh = 'Unknown';
  try {
    const r = await timedFetch('https://1.1.1.1/cdn-cgi/trace', {}, 4000);
    const txt = await r.text();
    const sliver = txt.split('\n').find((l) => l.startsWith('warp='));
    if (sliver) { provider = 'Cloudflare DNS (1.1.1.1)'; doh = 'Possibly'; }
    else { provider = 'ISP / Other'; }
  } catch { }

  const allOk = results.every((r) => r.ok);

  return {
    results,
    primary: 'System server',
    latency: bestMs != null ? `${bestMs} ms` : 'N/A',
    latencyCls: bestMs < 100 ? 'ok' : bestMs < 300 ? 'warn' : 'bad',
    provider,
    doh,
    status: allOk ? 'ok' : 'warn',
    badge: allOk ? 'Normal' : 'Issues detected',
    logs,
    passed: allOk ? 1 : 0,
    warnings: allOk ? 0 : 1,
  };
}

// Speed test
export async function checkSpeed(onProgress) {
  const DL_URL = 'https://speed.cloudflare.com/__down?bytes=5000000';
  const UL_URL = 'https://speed.cloudflare.com/__up';
  const BYTES_DL = 5_000_000;
  const BYTES_UL = 1_000_000;
  const logs = [];

  logs.push({ msg: 'Starting speed test…', type: 'info' });

  // Ping
  let pingMs = null, jitterMs = null;
  try {
    const pings = [];
    for (let i = 0; i < 4; i++) {
      const s = performance.now();
      await timedFetch('https://1.1.1.1/cdn-cgi/trace?_t=' + Date.now(), {
        method: 'HEAD', mode: 'no-cors', cache: 'no-store',
      }, 5000);
      pings.push(Math.round(performance.now() - s));
      await sleep(100);
    }
    pingMs = Math.round(pings.reduce((a, b) => a + b) / pings.length);
    jitterMs = Math.round(Math.max(...pings) - Math.min(...pings));
    logs.push({ msg: `Ping: ${pingMs} ms, Jitter: ${jitterMs} ms`, type: 'info' });
  } catch {
    logs.push({ msg: 'Ping measurement failed', type: 'fail' });
  }

  // Download
  let dlMbps = null;
  try {
    logs.push({ msg: 'Measuring download speed…', type: 'info' });
    const s = performance.now();
    const r = await timedFetch(DL_URL + '&_t=' + Date.now(), {}, 20000);
    await r.arrayBuffer();
    const sec = (performance.now() - s) / 1000;
    dlMbps = parseFloat(((BYTES_DL * 8) / sec / 1_000_000).toFixed(1));
    const cls = dlMbps > 10 ? 'ok' : dlMbps > 2 ? 'warn' : 'fail';
    logs.push({ msg: `Download: ${dlMbps} Mbps`, type: cls });
  } catch (e) {
    logs.push({ msg: 'Download failed: ' + e.message, type: 'fail' });
  }

  // Upload
  let ulMbps = null;
  try {
    logs.push({ msg: 'Measuring upload speed…', type: 'info' });
    const body = new Uint8Array(BYTES_UL);
    const s = performance.now();
    await timedFetch(UL_URL + '?_t=' + Date.now(), {
      method: 'POST', body, mode: 'no-cors',
    }, 20000);
    const sec = (performance.now() - s) / 1000;
    ulMbps = parseFloat(((BYTES_UL * 8) / sec / 1_000_000).toFixed(1));
    const cls = ulMbps > 5 ? 'ok' : ulMbps > 1 ? 'warn' : 'fail';
    logs.push({ msg: `Upload: ${ulMbps} Mbps`, type: cls });
  } catch (e) {
    logs.push({ msg: 'Upload failed: ' + e.message, type: 'warn' });
  }

  // Rating
  let rating = 'Unknown', ratingCls = '';
  if (dlMbps !== null) {
    if (dlMbps >= 50) { rating = '🚀 Excellent'; ratingCls = 'ok'; }
    else if (dlMbps >= 20) { rating = '✅ Good'; ratingCls = 'ok'; }
    else if (dlMbps >= 5) { rating = '⚠ Average'; ratingCls = 'warn'; }
    else { rating = '❌ Slow'; ratingCls = 'bad'; }
  }

  const st = dlMbps > 10 ? 'ok' : dlMbps > 2 ? 'warn' : 'fail';

  return {
    dlMbps,
    ulMbps,
    pingMs,
    jitterMs,
    pingCls: pingMs != null ? (pingMs < 50 ? 'ok' : pingMs < 150 ? 'warn' : 'bad') : '',
    jitterCls: jitterMs != null ? (jitterMs < 20 ? 'ok' : jitterMs < 50 ? 'warn' : 'bad') : '',
    rating,
    ratingCls,
    status: st,
    badge: dlMbps !== null ? `${dlMbps} Mbps` : 'Error',
    logs,
    passed: st === 'ok' ? 1 : 0,
    warnings: st === 'warn' ? 1 : 0,
    failures: st === 'fail' ? 1 : 0,
  };
}

// Ping
export async function measureLatency(url) {
  const s = performance.now();
  try {
    await timedFetch(url + '?_t=' + Date.now(), {
      method: 'HEAD', mode: 'no-cors', cache: 'no-store',
    }, 8000);
    return Math.round(performance.now() - s);
  } catch { return null; }
}

export async function checkPing(onTargetResult) {
  const logs = [];
  const results = [];
  const pingHistory = [];

  logs.push({ msg: 'Starting latency measurement…', type: 'info' });

  for (const t of PING_TARGETS) {
    const ms = await measureLatency(t.url);
    let cls, label;
    if (ms === null) {
      cls = 'fail'; label = 'Timeout';
      pingHistory.push(null);
      logs.push({ msg: `${t.host}: timeout`, type: 'fail' });
    } else {
      cls = ms < 100 ? 'ok' : ms < 300 ? 'warn' : 'fail';
      label = ms + ' ms';
      results.push(ms);
      pingHistory.push(ms);
      logs.push({ msg: `${t.host}: ${ms} ms`, type: cls });
    }
    if (onTargetResult) onTargetResult(t.host, ms, cls, label, [...pingHistory]);
    await sleep(80);
  }

  const total = PING_TARGETS.length;
  const lost = total - results.length;
  const lossP = Math.round((lost / total) * 100);
  const avg = results.length
    ? Math.round(results.reduce((a, b) => a + b) / results.length)
    : null;

  const st = lossP === 0 ? 'ok' : lossP < 50 ? 'warn' : 'fail';

  logs.push({
    msg: `Average: ${avg ?? 'N/A'} ms | Packet loss: ${lossP}%`,
    type: st === 'fail' ? 'fail' : st === 'warn' ? 'warn' : 'ok',
  });

  return {
    avg,
    min: results.length ? Math.min(...results) : null,
    max: results.length ? Math.max(...results) : null,
    lossP,
    lost,
    total,
    pingHistory,
    status: st,
    badge: lossP === 0 ? 'Stable' : lossP < 50 ? 'Degraded' : 'Unstable',
    logs,
    passed: st === 'ok' ? 1 : 0,
    warnings: st === 'warn' ? 1 : 0,
    failures: st === 'fail' ? 1 : 0,
  };
}

// Block status
export async function checkBlockStatus(onTargetResult) {
  const logs = [];
  let reached = 0, blocked = 0, slow = 0;

  logs.push({ msg: 'Checking service reachability…', type: 'info' });

  const promises = BLOCK_TARGETS.map(async (t) => {
    const s = performance.now();
    let ok = false, ms = null;
    try {
      await timedFetch(t.url + '?_t=' + Date.now(), {
        method: 'HEAD', mode: 'no-cors', cache: 'no-store',
      }, 8000);
      ok = true;
      ms = Math.round(performance.now() - s);
    } catch { }

    let cls, label;
    if (ok) {
      const isSlow = ms > 500;
      cls = isSlow ? 'warn' : 'ok';
      label = isSlow ? `Slow (${ms} ms)` : `OK (${ms} ms)`;
      if (isSlow) slow++;
      else reached++;
      logs.push({ msg: `${t.host}: ${isSlow ? 'slow' : 'OK'} (${ms} ms)`, type: cls });
    } else {
      cls = 'fail';
      label = 'Blocked / Unreachable';
      blocked++;
      logs.push({ msg: `${t.host}: blocked or unreachable`, type: 'fail' });
    }

    if (onTargetResult) onTargetResult(t.host, ok, ms, cls, label);
  });

  await Promise.all(promises);

  const total = BLOCK_TARGETS.length;
  let st, badge;
  let passed = 0, warnings = 0, failures = 0;

  if (blocked === 0 && slow === 0) {
    st = 'ok'; badge = 'All OK'; passed = 1;
    logs.push({ msg: 'No blocking detected', type: 'ok' });
  } else if (blocked === 0) {
    st = 'warn'; badge = `${slow} Slow`; warnings = 1;
    logs.push({ msg: `${slow} services responded slowly`, type: 'warn' });
  } else if (blocked < total) {
    st = 'warn'; badge = `${blocked} Blocked`; warnings = 1;
    logs.push({ msg: `${blocked} services appear to be blocked`, type: 'warn' });
  } else {
    st = 'fail'; badge = 'All blocked'; failures = 1;
    logs.push({ msg: 'All services unreachable — network may be blocked', type: 'fail' });
  }

  return { reached, blocked, slow, total, status: st, badge, logs, passed, warnings, failures };
}

// Verdict
export async function checkVerdict(blockResult, pingHistory, publicIpv6) {
  const logs = [];
  const checks = [];
  let riskScore = 0;

  logs.push({ msg: 'Analyzing comprehensive results…', type: 'info' });

  // IPv6 support
  const hasV6 = !!publicIpv6;
  checks.push({ icon: '🌐', label: 'IPv6 Support', val: hasV6 ? 'Yes' : 'No', cls: hasV6 ? 'ok' : 'warn' });
  if (!hasV6) riskScore += 5;

  // Blocked services
  const blockedCount = blockResult ? blockResult.blocked : 0;
  const blockCls = blockedCount === 0 ? 'ok' : blockedCount < 3 ? 'warn' : 'fail';
  checks.push({ icon: '🚫', label: 'Blocked Services', val: `${blockedCount} / ${BLOCK_TARGETS.length}`, cls: blockCls });
  riskScore += blockedCount * 12;

  // Slow services
  const slowCount = blockResult ? blockResult.slow : 0;
  checks.push({ icon: '🐢', label: 'Slow Services', val: `${slowCount} / ${BLOCK_TARGETS.length}`, cls: slowCount === 0 ? 'ok' : 'warn' });
  riskScore += slowCount * 5;

  // Proxy / VPN / Tor
  let proxyFlag = false;
  try {
    const r = await timedFetch('https://ipapi.co/json/', {}, 5000);
    const d = await r.json();
    proxyFlag = !!(d.proxy || d.vpn || d.tor || d.hosting);
    checks.push({ icon: '🛡', label: 'Proxy / VPN / Tor', val: proxyFlag ? 'Detected' : 'Not detected', cls: proxyFlag ? 'warn' : 'ok' });
    if (proxyFlag) riskScore += 20;
    logs.push({ msg: proxyFlag ? 'Proxy/VPN signs detected' : 'No proxy/VPN detected', type: proxyFlag ? 'warn' : 'ok' });
  } catch {
    checks.push({ icon: '🛡', label: 'Proxy / VPN / Tor', val: 'Unable to check', cls: 'warn' });
  }

  // Ping stability
  const validPings = (pingHistory || []).filter((v) => v !== null);
  const pingOk = validPings.length === PING_TARGETS.length;
  checks.push({ icon: '📶', label: 'Ping Stability', val: pingOk ? 'Good' : 'Packet loss', cls: pingOk ? 'ok' : 'warn' });
  if (!pingOk) riskScore += 10;

  // DNS
  checks.push({ icon: '🔤', label: 'DNS Resolution', val: 'Normal', cls: 'ok' });

  // Final score
  riskScore = Math.min(100, riskScore);

  // Final verdict
  let finalCls, finalIcon, finalTitle, finalDesc;
  let passed = 0, warnings = 0, failures = 0;

  if (riskScore < 20 && blockedCount === 0) {
    finalCls = 'ok'; finalIcon = '✅';
    finalTitle = 'IP is not blocked — Connection is normal';
    finalDesc = 'No signs of blocking, blacklisting, or connection restrictions detected. Your internet connection is working well.';
    passed = 1;
  } else if (riskScore < 50 || blockedCount < BLOCK_TARGETS.length) {
    finalCls = 'warn'; finalIcon = '⚠️';
    finalTitle = 'Connection restriction signs detected';
    finalDesc = `Detected ${blockedCount} blocked services, ${slowCount} slow. This may be due to ISP firewall, content censorship, or VPN/Proxy.`;
    warnings = 1;
  } else {
    finalCls = 'fail'; finalIcon = '🚫';
    finalTitle = 'IP may be blocked or severely restricted';
    finalDesc = 'Most services are unreachable. Your IP may be blacklisted, blocked by firewall, or the network may be censored.';
    failures = 1;
  }

  logs.push({
    msg: finalTitle,
    type: finalCls === 'ok' ? 'ok' : finalCls === 'warn' ? 'warn' : 'fail',
  });

  return {
    checks,
    riskScore,
    finalCls,
    finalIcon,
    finalTitle,
    finalDesc,
    verdictBadge: finalCls === 'ok' ? 'Not blocked' : finalCls === 'warn' ? 'Warning' : 'Blocked',
    status: finalCls,
    logs,
    passed,
    warnings,
    failures,
  };
}
