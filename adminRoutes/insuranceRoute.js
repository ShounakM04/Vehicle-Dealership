const express = require("express");
const {handleInsuranceDetails,handleGetInsuranceDetails} = require("../adminControllers/insuranceController");
const upload = require("../middlewares/multer.middleware")
const router = express.Router();

router.get("/",handleGetInsuranceDetails);

router.post("/",upload.array('images',5),handleInsuranceDetails);

module.exports = router;