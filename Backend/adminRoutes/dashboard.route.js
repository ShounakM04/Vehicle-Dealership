const express = require("express");
const handleRecordDeletion = require("../controllers/deleteRecord.controller");
const handleDashboard = require("../adminControllers/dashboard.controller");
const handleSellCar = require("../adminControllers/sellcar.controller")
const { authenticateToken, authorizeAdmin } = require("../controllers/userRole-auth");

const router = express.Router();

// router.get("/" ,authenticateToken,authorizeAdmin,handleDashboard);
router.get("/" ,handleDashboard);
router.post("/sell-car",handleSellCar);

module.exports = router;