const express = require("express");
const handleRecordDeletion = require("../controllers/deleteRecord.controller");
const handleDashboard = require("../adminControllers/dashboard.controller");
const handleSellCar = require("../adminControllers/sellcar.controller")
const {handleAddNotice, handleDeleteNotice,handleGetNotice}= require("../controllers/addNotice.controller")
const upload = require("../middlewares/multer.middleware.js");

const { authenticateToken, authorizeAdmin } = require("../controllers/userRole-auth");

const router = express.Router();

// router.get("/" ,authenticateToken,authorizeAdmin,handleDashboard);
router.get("/" ,handleDashboard);
router.post("/sell-car",upload.fields([
    { name: 'insuranceDocument', maxCount: 1 },
    { name: 'carPhoto', maxCount: 5 } // Adjust maxCount for car photos if needed
]),handleSellCar);
// router.post("/",upload.fields([{ name: 'insuranceDocument' , maxCount: 1 }, { name: 'carPhoto', maxCount: 10 }]),handleSellCar);

// router.post("/add-notice",handleAddNotice)
router.post("/add-notice",upload.array("images[]",20),handleAddNotice);

router.get("/get-notice",handleGetNotice);
router.delete("/delete-notice",handleDeleteNotice)

module.exports = router;