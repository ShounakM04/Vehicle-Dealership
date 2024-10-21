const express = require("express");
const handleCarDetails = require("../adminControllers/cardetailsController");

router = express.Router();

router.get("/",(req,res)=>{
    return res.render("detailsUpload");
});

router.post("/",handleCarDetails);

module.exports = router;