const express = require("express");
const {generatePresignedUploadUrl,handleDeleteImage} = require("../controllers/s3ImageFunctions.controller.js");

const Imagerouter = express.Router();


Imagerouter.get('/generate-upload-url', generatePresignedUploadUrl);
Imagerouter.delete("/",handleDeleteImage)

module.exports = Imagerouter;
