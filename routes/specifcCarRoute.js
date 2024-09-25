const express = require("express"); 
const handleSpecifiPage = require("../controllers/specifcCarController");

router = express.Router();

router.get("/:registrationnumber",handleSpecifiPage);

module.exports = router;        