const multer = require("multer");
const express = require("express")
//const upload = multer({dest: 'uploads/'})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./temp")
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname);
    }
  })

  const upload = multer({storage });

  
module.exports = upload;

 