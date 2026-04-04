const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

/**
 * Create a page in a Notion database.
 * @param {string} databaseId - The database to add the page to
 * @param {object} properties - Notion property values
 * @param {Array} [children] - Optional block children (page body content)
 * @returns {object} Created page
 */
export async function createNotionPage(databaseId, properties, children = null) {
  const body = {
    parent: { database_id: databaseId },
    properties,
  };
  if (children) {
    body.children = children;
  }

  const res = await fetch(`${NOTION_API_URL}/pages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Notion createPage error ${res.status}: ${JSON.stringify(err)}`);
  }

  return res.json();
}

/**
 * Query a Notion database with optional filter and sorts.
 * @param {string} databaseId
 * @param {object} [filter] - Notion filter object
 * @param {Array} [sorts] - Notion sorts array
 * @param {number} [pageSize=10]
 * @returns {object} Query results
 */
export async function queryNotionDatabase(databaseId, filter = undefined, sorts = undefined, pageSize = 10) {
  const body = { page_size: pageSize };
  if (filter) body.filter = filter;
  if (sorts) body.sorts = sorts;

  const res = await fetch(`${NOTION_API_URL}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Notion queryDatabase error ${res.status}: ${JSON.stringify(err)}`);
  }

  return res.json();
}

/**
 * Update an existing Notion page's properties.
 * @param {string} pageId
 * @param {object} properties - Properties to update
 * @returns {object} Updated page
 */
export async function updateNotionPage(pageId, properties) {
  const res = await fetch(`${NOTION_API_URL}/pages/${pageId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Notion updatePage error ${res.status}: ${JSON.stringify(err)}`);
  }

  return res.json();
}
