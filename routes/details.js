const express = require("express");
const handleCarDetails = require("../controllers/cardetails");

router = express.Router();

router.get("/details",(req,res)=>{
    res.render("carDetails");
});

router.post("/details",handleCarDetails);

module.exports = router;