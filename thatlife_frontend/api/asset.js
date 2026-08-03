// Vercel serverless proxy for Sanity asset uploads — avoids browser CORS for images.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

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

  const contentType = req.headers['content-type'] || 'application/octet-stream';
  const filename = typeof req.query.filename === 'string' ? req.query.filename : 'upload.bin';
  const body = await readRawBody(req);

  const url = `https://${projectId}.api.sanity.io/v2021-11-16/assets/images/production?filename=${encodeURIComponent(filename)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': contentType,
      },
      body,
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Sanity asset proxy failed', detail: String(error) });
  }
}
