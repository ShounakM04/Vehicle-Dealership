const { S3Client, GetObjectCommand,  PutObjectCommand} =require ("@aws-sdk/client-s3");
const  { getSignedUrl } =require ("@aws-sdk/s3-request-presigner");
require('dotenv').config(); 

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY,
        secretAccessKey: process.env.AMAZON_SECRET_KEY,
    }
});

<<<<<<< HEAD
async function getObjectURL(name) {
    const commmand = new GetObjectCommand({
        Bucket: "cardealerbucket",
        Key: name,
=======
async function getObjectURL(key) {
    const commmand = new GetObjectCommand({
        Bucket: "cardealerbucket",
        Key: key,
>>>>>>> 3da7b74e84f93ce96df14e979d9336d3a1306ab0
    });
    const url = await getSignedUrl(s3Client,commmand);
    return url;
}

async function putObject(filename,filetype) {
    const commmand =  new PutObjectCommand({
        Bucket : "cardealerbucket",
        Key: `uploads/${filename}`,
        ContentType : filetype,
    });
    const url = await getSignedUrl(s3Client,commmand);
    return url;
}


async function init() {
    console.log("URL for image",await getObjectURL("audit_ppt.jpg"))
}

init();