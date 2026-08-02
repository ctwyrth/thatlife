// Vercel serverless proxy for Sanity GROQ — avoids browser CORS for portfolio demo.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const token = process.env.VITE_SANITY_TOKEN || process.env.SANITY_TOKEN;

  if (!projectId) {
    return res.status(500).json({ error: 'Missing Sanity project ID' });
  }

  const query =
    typeof req.query.query === 'string'
      ? req.query.query
      : typeof req.body?.query === 'string'
        ? req.body.query
        : null;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  const params = new URLSearchParams({ query });
  const url = `https://${projectId}.api.sanity.io/v2021-11-16/data/query/production?${params}`;

  try {
    const headers = { Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { headers });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Sanity proxy failed', detail: String(error) });
  }
}
