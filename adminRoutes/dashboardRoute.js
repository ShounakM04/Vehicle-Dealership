const express = require("express");
const handleRecordDeletion = require("../controllers/deleteRecord.controller");
const handleDashboard = require("../adminControllers/dashboardController");
const { authenticateToken, authorizeAdmin } = require("../controllers/userRole-auth");

const router = express.Router();

router.get("/" ,authenticateToken,authorizeAdmin,handleDashboard);

module.exports = router;