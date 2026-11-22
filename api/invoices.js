const { put, list, del } = require('@vercel/blob');
const { checkAuth } = require('./_auth');

const INVOICES_LIST_FILE = 'invoices/all_invoices_meta.json';

module.exports = async function handler(req, res) {
  // Auth required for all operations on full invoices list
  if (!checkAuth(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // GET: Retrieve all saved invoices
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: INVOICES_LIST_FILE, limit: 1 });
      if (!blobs || blobs.length === 0) {
        return res.status(200).json({ success: true, invoices: [] });
      }
      const resp = await fetch(blobs[0].url);
      const invoices = await resp.json();
      return res.status(200).json({ success: true, invoices: Array.isArray(invoices) ? invoices : [] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message, invoices: [] });
    }
  }

  // POST: Add or update an invoice in the list
  if (req.method === 'POST') {
    try {
      const { invoice } = req.body || {};
      if (!invoice) {
        return res.status(400).json({ success: false, error: 'Missing invoice object' });
      }

      // Fetch existing list
      let currentList = [];
      const { blobs } = await list({ prefix: INVOICES_LIST_FILE, limit: 1 });
      if (blobs && blobs.length > 0) {
        try {
          const resp = await fetch(blobs[0].url);
          currentList = await resp.json();
          if (!Array.isArray(currentList)) currentList = [];
        } catch (e) {
          currentList = [];
        }
      }

      // Upsert
      const existingIdx = currentList.findIndex(item => item.id === invoice.id || (item.data && invoice.data && item.data.invoiceNumber === invoice.data.invoiceNumber));
      if (existingIdx !== -1) {
        currentList[existingIdx] = invoice;
      } else {
        currentList.unshift(invoice);
      }

      await put(INVOICES_LIST_FILE, JSON.stringify(currentList), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });

      return res.status(200).json({ success: true, count: currentList.length });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Delete an invoice from the list
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing invoice ID' });
    }

    try {
      let currentList = [];
      const { blobs } = await list({ prefix: INVOICES_LIST_FILE, limit: 1 });
      if (blobs && blobs.length > 0) {
        try {
          const resp = await fetch(blobs[0].url);
          currentList = await resp.json();
          if (!Array.isArray(currentList)) currentList = [];
        } catch (e) {
          currentList = [];
        }
      }

      currentList = currentList.filter(item => String(item.id) !== String(id) && item.data?.invoiceNumber !== id);

      await put(INVOICES_LIST_FILE, JSON.stringify(currentList), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });

      return res.status(200).json({ success: true, count: currentList.length });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};
