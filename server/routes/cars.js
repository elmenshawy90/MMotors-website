const express = require('express');
const router = express.Router();
const { getCars, getFeatured, getCarById } = require('../controllers/carController');
const { getCarImagesByCarId } = require('../controllers/carImageController');

router.get('/featured', getFeatured);
router.get('/', getCars);
router.get('/:id/images', getCarImagesByCarId);
router.get('/:id', getCarById);

module.exports = router;