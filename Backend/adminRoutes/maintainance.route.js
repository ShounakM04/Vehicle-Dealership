const express = require("express")
const {handleGetMaintainanceDetails,handlePostMaintainanceDetails} = require("../adminControllers/maintainance.controller")
const { authenticateToken, authorizeEmployeeOrAdmin,authorizeDriverOrEmployeeOrAdmin } = require("../controllers/userRole-auth");
const logResReq = require('../log.js')

const router = express.Router();

router.get("/",authenticateToken, authorizeEmployeeOrAdmin,handleGetMaintainanceDetails);

router.post("/",authenticateToken, authorizeDriverOrEmployeeOrAdmin, logResReq("./user_activity_log.csv"), handlePostMaintainanceDetails);

module.exports = router;