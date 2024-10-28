const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
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

    async function uploadToS3(buffer, filename, contentType) {
        const command = new PutObjectCommand({
            Bucket: "cardealerbucket",
            Key: filename,
            Body: buffer,
            ContentType: contentType,
        });
        const url = await getSignedUrl(s3Client,command,{expiresIn : 1800});
        // return `https://cardealerbucket.s3.ap-south-1.amazonaws.com/${url}`;
        return url;
    }


    async function uploadToS3Image(buffer, filename) {
        const contentType = filename.endsWith('.png') ? "image/png" : "image/jpeg";
        return await uploadToS3(buffer, filename, contentType);
    }


async function uploadToS3Doc(buffer, filename) {
    return await uploadToS3(buffer, filename, "application/pdf");
}

async function  deleteObject(filename) {
    const command = DeleteObjectCommand({
        Bucket : "cardealerbucket",
        Key : filename
    });

    try {
        await s3Client.send(command);
        console.log("Object deleted successfully");
    } catch (error) {
        res.status(500).send({message : "Internal Server Error"});
    }
    
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



module.exports = { s3Client, getObjectURL, uploadToS3Image,uploadToS3Doc,listImagesInFolder,deleteObject};