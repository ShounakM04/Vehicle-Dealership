const express = require("express");
const handleImageUpload = require("../controllers/imageUpload.controller.js");
const upload = require("../middlewares/multer.middleware.js");

const Imagerouter = express.Router();

Imagerouter.get("/", (req, res) => {
    return res.render("upload");
});

Imagerouter.post("/", upload.fields([{ name: 'displayImage', maxCount: 1 }, { name: 'images[]', maxCount: 10 }]), handleImageUpload);

module.exports = Imagerouter;
