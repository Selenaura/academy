// ═══════════════════════════════════════════════
// scripts/smoke-analytics.mjs — verificación de integridad analytics
//
// PROPÓSITO
// ─────────
// Detecta el bug del cap implícito de Supabase: si el endpoint /api/analytics
// devuelve menos rows de las que hay en DB, falla y bloquea el deploy.
//
// USO
// ───
// node --env-file=.env.local scripts/smoke-analytics.mjs
//
// Exit code 0 si OK, 1 si discrepancia detectada. Apto para pre-deploy hook
// o ejecución manual antes de `npx vercel deploy --prod`.
//
// QUÉ VERIFICA
// ────────────
// 1. Endpoint /api/analytics-debug responde 200 con JSON válido
// 2. summary.totalLeads coincide con SELECT COUNT(*) FROM leads (tolerancia ±1%)
// 3. summary.totalSales coincide con COUNT donde status='completed' (tolerancia 0)
// 4. summary.leadsToday > 0 si hubo leads en últimas 24h (sino warning, no error)
// ═══════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const ENDPOINT = process.env.ANALYTICS_ENDPOINT || 'https://academy.selenaura.com/api/analytics-debug';

if (!SUPABASE_URL || !SERVICE_KEY || !CRON_SECRET) {
  console.error('❌ Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET');
  process.exit(1);
}

const TOLERANCE = 0.01; // 1%

function color(c, s) {
  const codes = { red: 31, green: 32, yellow: 33, cyan: 36, gray: 90 };
  return `\x1b[${codes[c] || 0}m${s}\x1b[0m`;
}

async function supabaseCount(table, filter = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*${filter ? '&' + filter : ''}`;
  const r = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  const range = r.headers.get('content-range');
  if (!range) throw new Error(`No content-range header for ${table}`);
  const total = parseInt(range.split('/')[1], 10);
  if (isNaN(total)) throw new Error(`Invalid count for ${table}: ${range}`);
  return total;
}

async function fetchEndpoint() {
  const r = await fetch(`${ENDPOINT}?key=${CRON_SECRET}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Endpoint returned ${r.status}: ${await r.text()}`);
  return r.json();
}

const checks = [];

function check(name, fn) {
  checks.push({ name, fn });
}

check('Endpoint responde 200 con JSON', async () => {
  const data = await fetchEndpoint();
  if (!data.summary) throw new Error('Sin summary en respuesta');
  return `summary OK, ${Object.keys(data).length} keys`;
});

check('totalLeads coincide con DB (tolerancia 1%)', async () => {
  const data = await fetchEndpoint();
  const dbCount = await supabaseCount('leads');
  const endpointCount = data.summary.totalLeads;
  const delta = Math.abs(endpointCount - dbCount);
  const deltaPct = dbCount > 0 ? delta / dbCount : 0;

  if (deltaPct > TOLERANCE) {
    throw new Error(`DB=${dbCount}, endpoint=${endpointCount}, delta=${delta} (${(deltaPct * 100).toFixed(2)}%) > tolerance ${TOLERANCE * 100}%`);
  }
  return `DB=${dbCount}, endpoint=${endpointCount}, delta=${delta}`;
});

check('totalSales coincide con DB (status=completed)', async () => {
  const data = await fetchEndpoint();
  const dbCount = await supabaseCount('payments', 'status=eq.completed');
  const endpointCount = data.summary.totalSales;

  if (dbCount !== endpointCount) {
    throw new Error(`DB=${dbCount}, endpoint=${endpointCount}, mismatch (zero tolerance)`);
  }
  return `DB=${dbCount}, endpoint=${endpointCount}`;
});

check('Leads hoy >= leads en últimas 24h (warning si 0)', async () => {
  const data = await fetchEndpoint();
  const today = new Date().toISOString().slice(0, 10);
  const dbCount = await supabaseCount('leads', `created_at=gte.${today}T00:00:00`);
  const endpointCount = data.summary.leadsToday;

  if (dbCount > 0 && endpointCount === 0) {
    throw new Error(`DB tiene ${dbCount} leads hoy pero endpoint dice 0 — paginación rota`);
  }
  if (dbCount !== endpointCount) {
    return color('yellow', `DB=${dbCount}, endpoint=${endpointCount} (warning, no error)`);
  }
  return `DB=${dbCount}, endpoint=${endpointCount}`;
});

// ── Run ──
console.log(color('cyan', `Smoke test analytics → ${ENDPOINT}`));
console.log(color('gray', '─'.repeat(60)));

let failed = 0;
for (const { name, fn } of checks) {
  try {
    const result = await fn();
    console.log(color('green', '✓'), name, color('gray', '— ' + result));
  } catch (err) {
    failed++;
    console.log(color('red', '✗'), name);
    console.log(color('red', '   ' + err.message));
  }
}

console.log(color('gray', '─'.repeat(60)));
if (failed === 0) {
  console.log(color('green', `✓ ${checks.length}/${checks.length} checks passed`));
  process.exit(0);
} else {
  console.log(color('red', `✗ ${failed}/${checks.length} checks failed`));
  process.exit(1);
}
