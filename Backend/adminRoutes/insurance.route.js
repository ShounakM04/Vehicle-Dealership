const express = require("express");
const {handleInsuranceDetails,handleGetInsuranceDetails} = require("../adminControllers/insurance.controller");
const router = express.Router();

// router.get("/",handleGetInsuranceDetails);

// router.post("/",handleInsuranceDetails);

module.exports = router;