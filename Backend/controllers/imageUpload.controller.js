// //const express = require('express')
// const db = require('../models/database')
// const cloudin = require("./cloud.controller.js")
// const { imageUpload }= require('../utils/uploadFunctions.js')


// async function handleImageUpload(req,res){
//     const carNumber = req.body.carNumber;
//     //console.log(req.body);
//     if(!req.files){
//         return res.status(400).send("No files uploaded");
//     }
//     try{
//         const imageUrls = await imageUpload(carNumber, req.files);
//         const query = `INSERT INTO images (carNumber,image_urls) VALUES ($1,$2)`
//             const values = [carNumber,imageUrls];
//             await db.query(query,values);  
//         res.send("Images uploaded successfully")

//     }
//     catch(error){
//         console.log(`${error} : Error occured while uploadind the file`)
//     }
// }

// module.exports = handleImageUpload;

const db = require('../models/database');
const { imageUpload } = require('../utils/uploadFunctions.js');

async function handleImageUpload(req, res) {
    const carNumber = req.body.carNumber;

    if (!req.files) {
        return res.status(400).send("No files uploaded");
    }

    try {
        // Upload the display image if provided
        const displayImageUrls = req.files['displayImage'] 
            ? await imageUpload(carNumber, [req.files['displayImage'][0]]) 
            : [];

        // Upload other images if provided
        console.log(req.files['images[]'] );
        const otherImageUrls = req.files['images[]'] 
            ? await imageUpload(carNumber, req.files['images[]']) 
            : [];

        // Combine the URLs for display image and other images into respective fields
        const displayImageUrl = displayImageUrls.length > 0 ? displayImageUrls[0] : null;
        const imageUrls = otherImageUrls.length > 0 ? otherImageUrls : null;

        // Insert data into the database with 'display_image' field
        const query = `INSERT INTO images (carNumber, image_urls, display_image) VALUES ($1, $2, $3)`;
        const values = [carNumber, imageUrls, displayImageUrl];
        await db.query(query, values);

        res.send("Images uploaded successfully");
    } catch (error) {
        console.log(`${error} : Error occurred while uploading the file`);
        res.status(500).send("An error occurred during the file upload");
    }
}

module.exports = handleImageUpload;
