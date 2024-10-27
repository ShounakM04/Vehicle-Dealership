// const db = require("../models/database");

// async function handleSpecifiPage(req, res) {
//     try {
//         const regisNum = req.params.registrationnumber;
//         console.log(regisNum);
//         const values = [regisNum];

//         // Query to fetch car details
//         const query1 = `SELECT * FROM cardetails WHERE registernumber = $1`;
//         const detailsResult = await db.query(query1, values);

//         // Query to fetch images related to the car
//         const query2 = `SELECT image_urls FROM images WHERE carNumber = $1`;
//         const imageResults = await db.query(query2, values);

//         // Query to fetch car insurance details
//         const query3 = `SELECT * FROM carinsurance WHERE registernum = $1`;
//         const insuranceResults = await db.query(query3, values);

//         // Query to fetch owner details
//         const query4 = `SELECT * FROM ownerdetails WHERE registernumber = $1`;
//         const ownerResults = await db.query(query4, values);

//         if (detailsResult.rows.length > 0) {
//             const car = detailsResult.rows[0];
//             const images = imageResults.rows.length > 0 ? imageResults.rows[0].image_urls : []; // Getting image URLs array
//             const insurance = insuranceResults.rows[0]; // Assuming one insurance record per car
//             const owner = ownerResults.rows[0]; // Assuming one owner record per car

//             //console.log(car);

//             res.json({ car, images, insurance, owner });
//         } else {
//             res.status(400).send("Car not found");
//         }
//     } catch (error) {
//         console.log(`Error occurred: ${error}`);
//         res.status(500).send("Internal Server Error");
//     }
// }

// module.exports = handleSpecifiPage;



const db = require("../models/database");
const { getObjectURL, listImagesInFolder } = require("../amazonS3/s3config"); // Import S3 functions

async function handleSpecifiPage(req, res) {
    try {
        const regisNum = req.params.registrationnumber;
        console.log(`Registration Number: ${regisNum}`);
        const values = [regisNum];

        // Query to fetch car details
        const query1 = `SELECT * FROM cardetails WHERE registernumber = $1`;
        const detailsResult = await db.query(query1, values);

        // Query to fetch car insurance details
        const query3 = `SELECT * FROM carinsurance WHERE registernum = $1`;
        const insuranceResults = await db.query(query3, values);

        // Query to fetch owner details
        const query4 = `SELECT * FROM ownerdetails WHERE registernumber = $1`;
        const ownerResults = await db.query(query4, values);

        if (detailsResult.rows.length > 0) {
            const car = detailsResult.rows[0];
            const insurance = insuranceResults.rows[0]; // Assuming one insurance record per car
            const owner = ownerResults.rows[0]; // Assuming one owner record per car

            // S3 folder structure for images (e.g., regisNum/VehicleImages/)
            const imageFolder = `${regisNum}/VehicleImages/`;

            // Fetch image keys from the S3 folder
            const imageKeys = await listImagesInFolder(regisNum);
            console.log(`Image Keys for ${regisNum}: ${imageKeys}`);

            // Generate signed URLs for other images, starting from 1
            const imagesPromises = imageKeys.map(async (key, index) => {
                return await getObjectURL(key); // Generate URL for each image key
            });

            // // Generate signed URLs for each image key
            // const images = await Promise.all(imageKeys.map(async (key) => {
            //     return await getObjectURL(key); // Get signed URL for each key
            // }));

            // Wait for all other image promises to resolve
            const images = await Promise.all(imagesPromises);

            res.json({ car, images, insurance, owner });
        } else {
            res.status(400).send("Car not found");
        }
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = handleSpecifiPage;
