const express = require("express")
const {calculateProfit} = require("../adminControllers/profit.controller.js")

const router = express.Router();


router.get("/",calculateProfit);

module.exports = router;