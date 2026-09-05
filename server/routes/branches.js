const express = require('express');
const router = express.Router();
const { getActiveBranches } = require('../controllers/branchController');

// Public: return only active branches for the /branches page
router.get('/', getActiveBranches);

module.exports = router;
