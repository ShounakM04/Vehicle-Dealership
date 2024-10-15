const express = require("express")
const {handleGetMaintainanceDetails,handlePostMaintainanceDetails} = require("../adminControllers/maintainanceController")
const upload = require("../middlewares/multer.middleware")

const router = express.Router();


router.get("/",handleGetMaintainanceDetails);

router.post("/",upload.array("documents",5),handlePostMaintainanceDetails);

module.exports = router;