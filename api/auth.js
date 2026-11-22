const { generateToken } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { email, pin } = req.body || {};
    const normEmail = (email || '').trim().toLowerCase();
    const cleanPin = (pin || '').trim();

    const isEmailValid = normEmail === 'rathahun.hr@gmail.com';
    const isPinValid = cleanPin === '050592' || cleanPin === '2026';

    if (isEmailValid && isPinValid) {
      const token = generateToken(normEmail);
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({
        success: false,
        error: '❌ អ៊ីមែល ឬលេខកូដ PIN មិនត្រឹមត្រូវទេ!'
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
