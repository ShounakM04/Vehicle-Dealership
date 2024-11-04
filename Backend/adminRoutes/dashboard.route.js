import express from "express";
// import handleRecordDeletion from "../controllers/deleteRecord.controller";
import handleDashboard from "../adminControllers/dashboard.controller.js";
import { handleSellCar, getSoldCarDetails } from "../adminControllers/sellcar.controller.js";
import { handleDeleteNotice, handleGetNotice } from "../controllers/addNotice.controller.js";
// import upload from "../middlewares/multer.middleware.js";
// import { authenticateToken, authorizeAdmin } from "../controllers/userRole-auth";

const router = express.Router();

// router.get("/" ,authenticateToken,authorizeAdmin,handleDashboard);
router.get("/" ,handleDashboard);

router.post("/sell-car",handleSellCar);


router.get("/get-notice",handleGetNotice);
router.delete("/delete-notice",handleDeleteNotice)
router.get("/sold-cars", getSoldCarDetails)

export default router;