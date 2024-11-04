import express from "express";
import { calculateProfit } from "../adminControllers/profit.controller.js";

const router = express.Router();


router.get("/",calculateProfit);

// module.exports = router;
export default router
