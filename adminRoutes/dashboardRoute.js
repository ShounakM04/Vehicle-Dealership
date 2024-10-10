const express = require("express");
const handleRecordDeletion = require("../controllers/deleteRecord.controller");
const handleDashboard = require("../adminControllers/dashboardController");

const router = express.Router();

router.get("/" ,handleDashboard);

module.exports = router;