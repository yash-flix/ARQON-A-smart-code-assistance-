const express = require('express');
const {
  analyzeCode,
  fixBug,
  generateDocs,
  getHistory,
  
} = require('../controllers/codeController');
const { protect, checkApiLimit } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and check API limits
router.use(protect);

// Code analysis routes
router.post('/analyze', checkApiLimit, analyzeCode);
router.post('/fix-bug', checkApiLimit, fixBug);
router.post('/generate-docs', checkApiLimit, generateDocs);

// History routes
router.get('/history', getHistory);


module.exports = router;
