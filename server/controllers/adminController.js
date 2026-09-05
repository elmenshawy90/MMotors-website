const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM cars) AS total_cars,
        (SELECT COUNT(*) FROM cars WHERE availability = true) AS available_cars,
        (SELECT COUNT(*) FROM cars WHERE featured = true) AS featured_cars,
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') AS pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') AS completed_bookings,
        (SELECT COUNT(*) FROM buy_requests) AS total_purchase_requests,
        (SELECT COUNT(*) FROM buy_requests WHERE status = 'new') AS new_purchase_requests,
        (SELECT COUNT(*) FROM branches) AS total_branches,
        (SELECT COUNT(*) FROM branches WHERE is_active = true) AS active_branches`
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching stats.' });
  }
};