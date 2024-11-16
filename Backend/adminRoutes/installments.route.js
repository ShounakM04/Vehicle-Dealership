const express = require("express");

const {addInstallments, getInstallments} = require('../adminControllers/installment.controller.js')
const { authenticateToken, authorizeEmployeeOrAdmin } = require("../controllers/userRole-auth");


const router = express.Router();

router.post("/", addInstallments);
router.get("/",authenticateToken, authorizeEmployeeOrAdmin, logResReq("./user_activity_log.csv"), getInstallments);

module.exports = router