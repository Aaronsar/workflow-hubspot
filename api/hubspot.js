export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Missing Authorization header' });

  const hubspotUrl = `https://api.hubapi.com/${path}`;

  try {
    const options = {
      method: req.method,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    };

    if (req.method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(hubspotUrl, options);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
