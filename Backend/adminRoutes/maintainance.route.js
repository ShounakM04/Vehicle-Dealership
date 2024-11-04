import express from "express";
import { handleGetMaintainanceDetails, handlePostMaintainanceDetails } from "../adminControllers/maintainance.controller.js";

const router = express.Router();


router.get("/",handleGetMaintainanceDetails);

router.post("/",handlePostMaintainanceDetails);

export default router