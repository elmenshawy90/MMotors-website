const express = require('express');
const router = express.Router();
const { createBuyRequest } = require('../controllers/buyRequestController');
const { body, validationResult } = require('express-validator');

const buyRequestValidation = [
  body('customer_name').trim().isLength({ min: 2, max: 150 }).withMessage('Customer name must be 2-150 characters.'),
  body('phone_number').trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be 7-20 characters.'),
  body('email').optional({ values: 'null' }).trim().isEmail().withMessage('Please enter a valid email address.'),
  body('preferred_brand').optional({ values: 'null' }).trim().isIn(['Nissan', 'Suzuki']).withMessage('Please select Nissan or Suzuki.'),
  body('preferred_model').optional({ values: 'null' }).trim().isLength({ max: 100 }).withMessage('Model must be at most 100 characters.'),
  body('preferred_color').optional({ values: 'null' }).trim().isLength({ max: 50 }).withMessage('Color must be at most 50 characters.'),
  body('budget').optional({ values: 'null' }).isNumeric().withMessage('Budget must be a number.'),
  body('notes').optional({ values: 'null' }).trim().isLength({ max: 1000 }).withMessage('Notes must be at most 1000 characters.')
];

router.post(
  '/',
  buyRequestValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  },
  createBuyRequest
);

module.exports = router;
