const pool = require('../config/db');

exports.createBooking = async (req, res) => {
  const { customer_name, phone_number, car_id, service_type, preferred_date, preferred_time, notes } = req.body;

  if (!customer_name || !phone_number || !service_type || !preferred_date || !preferred_time) {
    return res.status(400).json({
      success: false,
      message: 'Customer name, phone number, service type, preferred date and preferred time are required.'
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(preferred_date))) {
    return res.status(400).json({ success: false, message: 'Preferred date must be in YYYY-MM-DD format.' });
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d/.test(String(preferred_time))) {
    return res.status(400).json({ success: false, message: 'Preferred time must be in HH:MM format.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings
        (customer_name, phone_number, car_id, service_type, preferred_date, preferred_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        customer_name, phone_number,
        car_id || null,
        service_type, preferred_date, preferred_time,
        notes || null
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating the booking.' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.brand, c.model
       FROM bookings b
       LEFT JOIN cars c ON b.car_id = c.id
       ORDER BY b.created_at DESC, b.id DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getBookings error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching bookings.' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use: pending, confirmed, completed or cancelled.' });
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateBookingStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating the booking.' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (err) {
    console.error('deleteBooking error:', err);
    res.status(500).json({ success: false, message: 'Server error while deleting the booking.' });
  }
};