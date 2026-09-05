const pool = require('../config/db');

exports.createBuyRequest = async (req, res) => {
  const { customer_name, phone_number, email, preferred_brand, preferred_model, preferred_color, budget, notes } = req.body;

  if (!customer_name || !phone_number) {
    return res.status(400).json({
      success: false,
      message: 'Customer name and phone number are required.'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO buy_requests
        (customer_name, phone_number, email, preferred_brand, preferred_model, preferred_color, budget, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new')
       RETURNING *`,
      [
        customer_name.trim(),
        phone_number.trim(),
        email ? email.trim() : null,
        preferred_brand || null,
        preferred_model ? preferred_model.trim() : null,
        preferred_color || null,
        budget ? Number(budget) : null,
        notes ? notes.trim() : null
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('createBuyRequest error:', err);
    res.status(500).json({ success: false, message: 'Server error while submitting your request.' });
  }
};

exports.getBuyRequests = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM buy_requests ORDER BY created_at DESC, id DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getBuyRequests error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching purchase requests.' });
  }
};

exports.updateBuyRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'completed', 'cancelled'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use: new, contacted, completed or cancelled.' });
    }

    const result = await pool.query(
      'UPDATE buy_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Purchase request not found.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateBuyRequestStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating the request.' });
  }
};

exports.deleteBuyRequest = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM buy_requests WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Purchase request not found.' });
    }
    res.json({ success: true, message: 'Purchase request deleted successfully.' });
  } catch (err) {
    console.error('deleteBuyRequest error:', err);
    res.status(500).json({ success: false, message: 'Server error while deleting the request.' });
  }
};
