const db = require('../models/database');
const { imageUpload } = require('../utils/uploadFunctions.js');

async function handleAddNotice(req, res) {
    const carNumber = req.body.carNumber;
    console.log(req.body);
    
    if (!req.files) {
        return res.status(400).send("No files uploaded");
    }
    
    try {
        // Upload images and get an array of URLs
        const imageUrls = await imageUpload(carNumber, req.files);

        // Loop through each URL and insert it individually
        for (const imageUrl of imageUrls) {
            const query = `INSERT INTO noticeImages (image_urls) VALUES ($1)`;
            const values = [imageUrl];
            await db.query(query, values);
        }

        res.send("Notice Images uploaded successfully");
    } catch (error) {
        console.log(`${error} : Error occurred while uploading the file`);
        res.status(500).send("An error occurred while uploading the images");
    }
}


async function handleGetNotice(req, res) {
    try {
        // Query to select all images from the noticeImages table
        const query = `SELECT serialnum, image_urls FROM noticeImages`;
        const result = await db.query(query);

        // Check if the result is empty
        if (result.rows.length === 0) {
            return res.status(404).send("No notice images found");
        }

        // Send the list of notice images as response
        console.log(result.rows)
        res.json(result.rows);

    } catch (error) {
        console.log(`${error} : Error occurred while fetching the notice images`);
        res.status(500).send("An error occurred while fetching the images");
    }
}

async function handleDeleteNotice(req, res) {
    const { serialnum } = req.query;  // Now using query parameter

    if (!serialnum) {
        return res.status(400).send("Serial number is required");
    }

    try {
        // Delete the image with the specified serialnum
        const query = `DELETE FROM noticeImages WHERE serialnum = $1 RETURNING *`;
        const values = [serialnum];
        const result = await db.query(query, values);

        // If no row was deleted, the serial number doesn't exist
        if (result.rowCount === 0) {
            return res.status(404).send("Notice image not found");
        }

        // Return success message if the image was deleted
        res.send(`Notice image with serial number ${serialnum} deleted successfully`);
    } catch (error) {
        console.log(`${error} : Error occurred while deleting the notice image`);
        res.status(500).send("An error occurred while deleting the notice image");
    }
}


module.exports = {handleAddNotice,
    handleGetNotice,
    handleDeleteNotice
};
