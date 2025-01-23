const express = require("express");

const { authenticateToken, authorizeEmployeeOrAdmin,authorizeDriverOrEmployeeOrAdmin } = require("../controllers/userRole-auth.js");
const {handleDeleteImageDescription}  = require("../controllers/ImageDescription.controller.js")

const router = express.Router();


router.delete("/",authenticateToken,authorizeEmployeeOrAdmin ,handleDeleteImageDescription);
module.exports = router;
