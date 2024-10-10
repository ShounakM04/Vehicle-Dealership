const express = require("express");
const handleRecordDeletion = require("../controllers/deleteRecord.controller");

const router = express.Router();

router.get("/" ,(req,res) =>{
    res.status(200).send("Delete page");
})

router.post("/deleteCarDetails",handleRecordDeletion);