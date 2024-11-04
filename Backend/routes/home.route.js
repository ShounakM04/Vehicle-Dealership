import express from "express";
import handleHomePage from "../controllers/home.controller.js";


const router = express.Router();

router.get("/", handleHomePage); // This will call the updated handleHomePage function

export default router;
