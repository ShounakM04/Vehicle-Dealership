const express = require("express"); 
const handleSpecifiPage = require("../controllers/specifcCarController");

router = express.Router();

router.get("/",handleSpecifiPage);

module.exports = router;        