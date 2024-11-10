const express = require("express");
const {handleEditCarDetails} = require("../controllers/editcardetails.controller.js");

router = express.Router();

router.get("/",(req,res)=>{
    res.status(200).send("edited");
});

router.post("/",handleEditCarDetails);

module.exports = router;