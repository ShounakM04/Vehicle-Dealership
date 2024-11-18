const express = require("express");
const { handleUserRegistration } = require("../adminControllers/userRegistration.controller");
const { authenticateToken, authorizeAdmin } = require("../controllers/userRole-auth");
const router = express.Router();

router.get("/",(req,res)=>{
    res.json("Registration page")
})

router.post("/",authorizeAdmin, handleUserRegistration);

module.exports = router;