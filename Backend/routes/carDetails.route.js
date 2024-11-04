import express from "express";
import handleCarDetails from "../controllers/cardetails.controller.js";


const router = express.Router();

router.get("/",(req,res)=>{
    res.status(200).send("Displayed");
});

router.post("/",handleCarDetails);

export default router;