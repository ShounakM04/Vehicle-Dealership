const express = require("express");
const {generatePresignedUploadUrl,handleDeleteImage} = require("../controllers/s3ImageFunctions.controller.js");
const { authenticateToken, authorizeEmployeeOrAdmin } = require("../controllers/userRole-auth");

const Imagerouter = express.Router();


Imagerouter.get('/generate-upload-url', authenticateToken, authorizeEmployeeOrAdmin,generatePresignedUploadUrl);
Imagerouter.delete("/",authenticateToken, authorizeEmployeeOrAdmin,handleDeleteImage)

module.exports = Imagerouter;
