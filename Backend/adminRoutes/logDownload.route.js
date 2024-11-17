const express = require('express');
const downloadLogFile = require('../adminControllers/logdownload.controller.js'); // import the controller

const router = express.Router();

// Route to download today's log CSV file
router.get('/', downloadLogFile);

module.exports = router;
