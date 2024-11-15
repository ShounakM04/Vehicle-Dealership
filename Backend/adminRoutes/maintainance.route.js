const express = require("express")
const {handleGetMaintainanceDetails,handlePostMaintainanceDetails} = require("../adminControllers/maintainance.controller")
const { authenticateToken, authorizeEmployeeOrAdmin } = require("../controllers/userRole-auth");


const router = express.Router();


router.get("/",authenticateToken, authorizeEmployeeOrAdmin,handleGetMaintainanceDetails);

router.post("/",authenticateToken, authorizeEmployeeOrAdmin,handlePostMaintainanceDetails);

module.exports = router;