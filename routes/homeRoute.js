const express = require("express");
const handleHomePage = require("../controllers/homeController");

const router = express.Router();

router.get("/",handleHomePage)

module.exports = router;