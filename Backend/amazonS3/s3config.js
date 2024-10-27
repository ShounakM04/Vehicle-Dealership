// const { S3Client, GetObjectCommand,  PutObjectCommand} =require ("@aws-sdk/client-s3");
// const  { getSignedUrl } =require ("@aws-sdk/s3-request-presigner");
// require('dotenv').config(); 

// const s3Client = new S3Client({
//     region: "ap-south-1",
//     credentials: {
//         accessKeyId: process.env.AMAZON_ACCESS_KEY,
//         secretAccessKey: process.env.AMAZON_SECRET_KEY,
//     }
// });

// async function getObjectURL(key) {
//     const commmand = new GetObjectCommand({
//         Bucket: "cardealerbucket",
//         Key: key,
//     });
//     const url = await getSignedUrl(s3Client,commmand);
//     return url;
// }

// async function putObject(filename,filetype) {
//     const commmand =  new PutObjectCommand({
//         Bucket : "cardealerbucket",
//         Key: `uploads/${filename}`,
//         ContentType : filetype,
//     });
//     const url = await getSignedUrl(s3Client,commmand);
//     return url;
// }


// async function init() {
//     console.log("URL for image",await getObjectURL("audit_ppt.jpg"))
// }

// init();

const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY,
        secretAccessKey: process.env.AMAZON_SECRET_KEY,
    },
});

// Generate a signed URL to retrieve an object
async function getObjectURL(key, expiresIn = 3600) { // default expiration set to 1 hour
    const command = new GetObjectCommand({
        Bucket: "cardealerbucket",
        Key: key,
    });
    
    // Generate a signed URL with an expiration time
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
}

// Upload file directly to S3
async function uploadToS3(buffer, filename, filetype) {
    const command = new PutObjectCommand({
        Bucket: "cardealerbucket",
        Key: `${filename}`,
        Body: buffer,
        ContentType: filetype,
    });
    await s3Client.send(command);
    return `https://cardealerbucket.s3.ap-south-1.amazonaws.com/${filename}`;
}

// List images in a specific folder
async function listImagesInFolder(carNumber) {
    const params = {
        Bucket: 'cardealerbucket', // Replace with your bucket name
        Prefix: `${carNumber}/VehicleImages/`, // Use the folder structure based on carNumber
    };

    try {
        const command = new ListObjectsV2Command(params); // Create command
        const data = await s3Client.send(command); // Send command

        // Check if data.Contents exists and has items
        if (!data.Contents || data.Contents.length === 0) {
            console.log(`No images found for car ${carNumber}`);
            return []; // Return an empty array if no images found
        }

        // Extract the keys of the images
        return data.Contents.map(item => item.Key); // Returns an array of keys
    } catch (error) {
        console.error(`Error listing images in folder for car ${carNumber}: ${error.message}`);
        throw error; // Rethrow to handle in the main function
    }
}



module.exports = { s3Client, getObjectURL, uploadToS3, listImagesInFolder };

