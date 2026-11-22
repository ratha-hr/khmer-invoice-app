const { put, list, del } = require('@vercel/blob');
const { checkAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  const { id } = req.query;

  // GET: Fetch single invoice by ID (Public read for customers & owner)
  if (req.method === 'GET') {
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing invoice ID' });
    }
    try {
      const filename = `invoices/inv_${encodeURIComponent(id)}.json`;
      const { blobs } = await list({ prefix: filename, limit: 1 });
      if (!blobs || blobs.length === 0) {
        return res.status(404).json({ success: false, error: 'Invoice not found' });
      }
      const resp = await fetch(blobs[0].url);
      const data = await resp.json();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Auth required for POST and DELETE
  if (!checkAuth(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // POST: Save or update single invoice
  if (req.method === 'POST') {
    const body = req.body || {};
    const invoiceId = body.id || id;
    const invoiceData = body.data || body.invoice || body;

    if (!invoiceId) {
      return res.status(400).json({ success: false, error: 'Missing invoice ID' });
    }

    try {
      const filename = `invoices/inv_${encodeURIComponent(invoiceId)}.json`;
      const blob = await put(filename, JSON.stringify(invoiceData), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });
      const shortUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/#view=1&id=${encodeURIComponent(invoiceId)}`;
      return res.status(200).json({ success: true, url: shortUrl, blobUrl: blob.url });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Delete single invoice
  if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing invoice ID' });
    }
    try {
      const filename = `invoices/inv_${encodeURIComponent(id)}.json`;
      const { blobs } = await list({ prefix: filename, limit: 1 });
      if (blobs && blobs.length > 0) {
        await del(blobs[0].url);
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};
