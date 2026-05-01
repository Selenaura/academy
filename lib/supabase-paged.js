// ═══════════════════════════════════════════════
// lib/supabase-paged.js — paginación automática para Supabase REST
//
// PROBLEMA QUE RESUELVE
// ─────────────────────
// El cliente Supabase JS tiene un cap implícito de 1000 rows en `.from().select()`.
// Si la tabla tiene >1000 filas, devuelve **silenciosamente** sólo los primeros
// 1000 sin error. No tira excepción, no warning, nada.
//
// Esto causó 28/04/2026 que el dashboard /analytics mostrara `leads_today: 0`
// cuando había 24 leads ese día — porque eran los más recientes y no entraban
// en los primeros 1000 (ordenados por defecto por created_at ASC implícito).
//
// REGLA DE USO
// ────────────
// **NUNCA** usar `.from(tabla).select()` directamente en endpoints que sirven
// agregaciones o conteos sobre tablas que pueden crecer >1000 filas.
//
// SIEMPRE usar `fetchAllPaged()` para esos casos. Si solo necesitas las N
// más recientes para mostrar (no para agregar), usa `.range(0, N-1)` explícito.
//
// EXCEPCIÓN
// ─────────
// Si la tabla está garantizadamente acotada (e.g. 12 zodiac signs, 9 cron jobs),
// puedes usar .from().select() directo. Comenta el motivo arriba.
// ═══════════════════════════════════════════════

const DEFAULT_PAGE_SIZE = 1000;
const SAFETY_MAX_OFFSET = 50000; // hard limit para evitar loops infinitos por bug

/**
 * Pagina automáticamente una query Supabase hasta agotar.
 *
 * @param {Object} client - Supabase client (createClient o admin de withAdmin)
 * @param {string} table - nombre de la tabla
 * @param {string} columns - select string (ej. 'id, email, created_at')
 * @param {Object} [options]
 * @param {number} [options.pageSize=1000] - tamaño de página
 * @param {number} [options.maxRows=50000] - safety cap
 * @param {Function} [options.queryBuilder] - fn opcional para añadir filters
 *   (rcv: query → return query con .eq/.gte/.order/etc)
 *
 * @returns {Promise<Array>} todos los rows que matchean
 *
 * @example
 *   // Caso simple
 *   const allLeads = await fetchAllPaged(admin, 'leads', 'id, email, created_at');
 *
 *   // Con filtros
 *   const recentLeads = await fetchAllPaged(admin, 'leads', '*', {
 *     queryBuilder: q => q.gte('created_at', '2026-04-01').order('created_at', { ascending: false })
 *   });
 */
export async function fetchAllPaged(client, table, columns, options = {}) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const maxRows = options.maxRows ?? SAFETY_MAX_OFFSET;
  const queryBuilder = options.queryBuilder;
  // Keyset pagination usa la columna passada como cursor estable.
  // Default 'id' (uuid o serial) — por convención todas las tablas SelenaUra
  // tienen `id` como PK. Si el caller pasa otra columna ordenable que sí
  // tenga unique constraint, se puede override.
  const cursorColumn = options.cursorColumn ?? 'id';

  // BUG 01/05/2026 (resuelto): la versión anterior usaba offset pagination
  // (.range(offset, offset+999)) SIN order estable. Postgres puede elegir
  // cualquier orden en queries sin ORDER BY, y con INSERTs concurrentes
  // los rows nuevos se "pierden" entre páginas (DB=1189, paged=1131,
  // delta 58 — los 17 leads de hoy invisibles porque entraron entre
  // page 1 y page 2). Ver error_log df6ecc11.
  //
  // Fix: keyset pagination con cursor estable. Cada página lee
  // WHERE cursor > last_seen_cursor, garantizando que NO se saltan rows
  // aunque haya INSERTs concurrentes durante la paginación.
  //
  // NB: si el queryBuilder añade su propio .order() en la primera página,
  // se respeta. Pero el cursor SIEMPRE es por cursorColumn (default 'id').
  // El caller puede pasar columns: 'id, created_at, ...' y luego en su
  // post-process hacer su propio sort si quiere otro orden semántico.

  const all = [];
  let lastCursor = null;
  let pageCount = 0;
  const maxPages = Math.ceil(maxRows / pageSize);

  while (pageCount < maxPages) {
    let query = client.from(table)
      .select(columns)
      .order(cursorColumn, { ascending: true })
      .limit(pageSize);

    // Aplicar cursor de keyset si no es la primera página
    if (lastCursor !== null) {
      query = query.gt(cursorColumn, lastCursor);
    }

    // queryBuilder permite añadir filtros adicionales (.eq, .gte, etc)
    // PERO no debería añadir su propio .order() ni .range() — los chocaría
    // con el keyset. Si el caller necesita orden semántico distinto,
    // que aplique sort en post-process del array devuelto.
    if (queryBuilder) query = queryBuilder(query);

    const { data, error } = await query;
    if (error) throw new Error(`fetchAllPaged(${table}): ${error.message}`);
    if (!data || data.length === 0) break;

    all.push(...data);
    pageCount++;

    // Última página: menos rows que pageSize → fin
    if (data.length < pageSize) break;

    // Avanzar cursor al último valor visto
    const lastRow = data[data.length - 1];
    if (!(cursorColumn in lastRow)) {
      throw new Error(
        `fetchAllPaged(${table}): cursor column '${cursorColumn}' not in select '${columns}'. ` +
        `Add it to columns string.`
      );
    }
    lastCursor = lastRow[cursorColumn];
  }

  if (pageCount >= maxPages) {
    console.warn(`[fetchAllPaged] safety cap reached for ${table} (${maxRows}+ rows). Increase maxRows if expected.`);
  }

  return all;
}

/**
 * Helper para count exacto sin descargar todas las filas.
 * Usa el header 'Prefer: count=exact' que Supabase respeta.
 *
 * @param {Object} client - Supabase client
 * @param {string} table
 * @param {Function} [queryBuilder] - opcional
 * @returns {Promise<number>}
 *
 * @example
 *   const total = await countRows(admin, 'leads');
 *   const todayCount = await countRows(admin, 'leads',
 *     q => q.gte('created_at', new Date().toISOString().slice(0, 10)));
 */
export async function countRows(client, table, queryBuilder) {
  let query = client.from(table).select('*', { count: 'exact', head: true });
  if (queryBuilder) query = queryBuilder(query);

  const { count, error } = await query;
  if (error) throw new Error(`countRows(${table}): ${error.message}`);
  return count ?? 0;
}
