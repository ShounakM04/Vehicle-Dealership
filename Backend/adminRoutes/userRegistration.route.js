import express from "express";
import { handleUserRegistration } from "../adminControllers/userRegistration.controller.js";
const router = express.Router();

router.get("/",(req,res)=>{
    res.json("Registration page")
})

router.post("/",handleUserRegistration);

// module.exports = router;
export default router
