const express = require("express"); 
const handleSpecifiPage = require("../controllers/specificCar");

router = express.Router();

router.get("/:registrationnumber",handleSpecifiPage);

module.exports = router;