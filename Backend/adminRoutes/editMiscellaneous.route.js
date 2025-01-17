const express = require("express");
const { editMiscellaneousFields} = require('../adminControllers/editMiscellaneous.controller.js')
const { authenticateToken, authorizeEmployeeOrAdmin } = require("../controllers/userRole-auth");


router = express.Router();

router.get("/",(req,res)=>{
    res.status(200).send("edited");
});

router.post("/",authenticateToken, authorizeEmployeeOrAdmin,editMiscellaneousFields);

module.exports = router;