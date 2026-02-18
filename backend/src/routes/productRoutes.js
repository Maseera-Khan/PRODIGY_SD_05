const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/scrape', productController.scrape);
router.get('/history', productController.getHistory);
router.post('/download-csv', productController.downloadCsv);

module.exports = router;
