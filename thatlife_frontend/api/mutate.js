// Vercel serverless proxy for Sanity mutations — avoids browser CORS for writes.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const token = process.env.VITE_SANITY_TOKEN || process.env.SANITY_TOKEN;

  if (!projectId || !token) {
    return res.status(500).json({ error: 'Missing Sanity project ID or token' });
  }

  if (!req.body?.mutations || !Array.isArray(req.body.mutations)) {
    return res.status(400).json({ error: 'Body must include a mutations array' });
  }

  const url = `https://${projectId}.api.sanity.io/v2021-11-16/data/mutate/production`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: req.body.mutations }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Sanity mutate proxy failed', detail: String(error) });
  }
}
