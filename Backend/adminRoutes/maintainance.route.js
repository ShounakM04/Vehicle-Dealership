const express = require("express")
const {handleGetMaintainanceDetails,handlePostMaintainanceDetails,handleDeleteMaintainanceDetails} = require("../adminControllers/maintainance.controller")
const { authenticateToken, authorizeAdmin, authorizeEmployeeOrAdmin,authorizeDriverOrEmployeeOrAdmin } = require("../controllers/userRole-auth");
const logResReq = require('../log.js')

const router = express.Router();

router.get("/",authenticateToken, authorizeEmployeeOrAdmin,handleGetMaintainanceDetails);

router.post("/",authenticateToken, authorizeDriverOrEmployeeOrAdmin, handlePostMaintainanceDetails);

router.delete("/delete-maintainance",authenticateToken, authorizeAdmin, handleDeleteMaintainanceDetails);


module.exports = router;