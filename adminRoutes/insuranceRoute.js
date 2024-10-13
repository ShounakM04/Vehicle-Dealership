const express = require("express");
const handleInsuranceDetails = require("../adminControllers/insuranceController");
const upload = require("../middlewares/multer.middleware")
const router = express.Router();

router.get("/",(req,res) => {
    res.json("Insurance details page")
})

router.post("/",upload.array("images[]",5),handleInsuranceDetails);

module.exports = router;