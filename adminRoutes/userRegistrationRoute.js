const express = require("express");
const { handleUserRegistration } = require("../adminControllers/userRegistrationController");

const router = express.Router();

router.get("/",(req,res)=>{
    res.json("Registration page")
})

router.post("/",handleUserRegistration);

module.exports = router;
