const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createCar, updateCar, deleteCar } = require('../controllers/carController');
const { getBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const { getBuyRequests, updateBuyRequestStatus, deleteBuyRequest } = require('../controllers/buyRequestController');
const {
  getCarImagesByCarId, uploadCarImages, deleteCarImage, setPrimaryCarImage, reorderCarImages
} = require('../controllers/carImageController');
const { getStats } = require('../controllers/adminController');
const { updateContent } = require('../controllers/contentController');
const {
  getBranches, getBranchById, createBranch, updateBranch, toggleBranchActive, deleteBranch
} = require('../controllers/branchController');

router.use(authenticateToken);

const carUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 12 }
]);

const branchUpload = upload.single('image');

// Car management
router.post('/cars', carUpload, createCar);
router.put('/cars/:id', carUpload, updateCar);
router.delete('/cars/:id', deleteCar);

// Car images (multi-image gallery)
router.get('/cars/:id/images', getCarImagesByCarId);
router.post('/cars/:id/images', upload.array('images', 12), uploadCarImages);
router.delete('/cars/:id/images/:imageId', deleteCarImage);
router.put('/cars/:id/images/:imageId/primary', setPrimaryCarImage);
router.put('/cars/:id/images/reorder', reorderCarImages);

// Booking management
router.get('/bookings', getBookings);
router.put('/bookings/:id', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

// Buy new car request management
router.get('/buy-requests', getBuyRequests);
router.put('/buy-requests/:id', updateBuyRequestStatus);
router.delete('/buy-requests/:id', deleteBuyRequest);

// Content management
router.put('/content/:sectionKey', updateContent);

// Branch management
router.get('/branches', getBranches);
router.get('/branches/:id', getBranchById);
router.post('/branches', branchUpload, createBranch);
router.put('/branches/:id', branchUpload, updateBranch);
router.patch('/branches/:id/active', toggleBranchActive);
router.delete('/branches/:id', deleteBranch);

// Dashboard stats
router.get('/stats', getStats);

module.exports = router;