const express = require('express');
const db = require('../models/database');
const cloudin = require("../controllers/photoUpload");

async function handleImageUpload(req, res) {
    const carNumber = req.body.carNumber;
    console.log(req.body);

    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded");
    }

    try {
        const imageUrls = [];
        for (const file of req.files) {
            // Check if the uploaded file is an image
            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).send("Only image files are allowed");
            }

            const filepath = file.path;
            const result = await cloudin(filepath);
            const imageUrl = result.secure_url;
            imageUrls.push(imageUrl);

            const query = `INSERT INTO carimages (registernumber, imageurl) VALUES ($1, $2)`;
            const values = [carNumber, imageUrl];
            await db.query(query, values);   
        }
        res.send("Images uploaded successfully");

    } catch (error) {
        console.log(`${error} : Error occurred while uploading the file`);
        res.status(500).send("An error occurred while uploading the images");
    }
}

module.exports = handleImageUpload;
