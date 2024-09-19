const express = require("express");
const handleImageUpload = require("../controllers/image");
const upload = require("../middlewares/multer.middleware");

router = express.Router();

router.get("/upload",(req,res)=>{
    res.render("upload");
})

router.post("/upload",upload.array("images[]",10),handleImageUpload);

module.exports = router;