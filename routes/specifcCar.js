const express = require("express"); 
const handleSpecifiPage = require("../controllers/specifcCar");

router = express.Router();

router.get("/:registrationnumber",handleSpecifiPage);

module.exports = router;