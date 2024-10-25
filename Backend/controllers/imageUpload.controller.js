//const express = require('express')
const db = require('../models/database')
const cloudin = require("./cloud.controller.js")
const { imageUpload }= require('../utils/uploadFunctions.js')


async function handleImageUpload(req,res){
    const carNumber = req.body.carNumber;
    //console.log(req.body);
    if(!req.files){
        return res.status(400).send("No files uploaded");
    }
    try{
        const imageUrls = await imageUpload(carNumber, req.files);
        const query = `INSERT INTO images (carNumber,image_urls) VALUES ($1,$2)`
            const values = [carNumber,imageUrls];
            await db.query(query,values);  
        res.send("Images uploaded successfully")

    }
    catch(error){
        console.log(`${error} : Error occured while uploadind the file`)
    }
}

module.exports = handleImageUpload;