import express from "express";
import handleSpecifiPage from "../controllers/specificCar.controller.js";

const router = express.Router();

router.get("/:registernumber", handleSpecifiPage);

// module.exports = router;
export default router
