import express from "express";
import { handleUserLogin } from "../adminControllers/userRegistration.controller.js";
 

const router = express.Router()


router.get("/",(req,res)=>{
    res.json("Login Page")
})

router.post("/",handleUserLogin);

// module.exports = router;/
export default router