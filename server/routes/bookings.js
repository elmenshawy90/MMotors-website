const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { body, validationResult } = require('express-validator');

const bookingValidation = [
  body('customer_name').trim().isLength({ min: 2, max: 150 }).withMessage('Customer name must be 2-150 characters.'),
  body('phone_number').trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be 7-20 characters.'),
  body('service_type').trim().isLength({ min: 3, max: 100 }).withMessage('Service type must be 3-100 characters.'),
  body('preferred_date').isISO8601().withMessage('Preferred date must be a valid date (YYYY-MM-DD).'),
  body('preferred_time').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Preferred time must be in HH:MM 24-hour format.')
];

router.post(
  '/',
  bookingValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  },
  createBooking
);

module.exports = router;