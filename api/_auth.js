const crypto = require('crypto');

const SECRET_KEY = process.env.AUTH_SECRET || 'ratha_stationery_secret_key_2026';

function generateToken(email) {
  const payload = {
    email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(str).digest('base64url');
  return `${str}.${hmac}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [str, hmac] = parts;
  const expectedHmac = crypto.createHmac('sha256', SECRET_KEY).update(str).digest('base64url');
  if (hmac !== expectedHmac) return null;
  try {
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function checkAuth(req) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  const payload = verifyToken(token);
  return payload !== null;
}

module.exports = { generateToken, verifyToken, checkAuth };
