const express = require("express")
const { authenticateToken, authorizeAdmin } = require("../controllers/userRole-auth");
const {calculateProfit} = require("../adminControllers/profit.controller.js")

const router = express.Router();


router.get("/",authenticateToken, authorizeAdmin,calculateProfit);

module.exports = router;