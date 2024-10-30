const { uploadToS3Image,uploadToS3 } = require('../amazonS3/s3config');

// Controller to directly call uploadToS3Image and return pre-signed URL
async function generatePresignedUploadUrl(req, res) {
    try {
        const { filename,filetype,path } = req.query; // Expect filename from the request body

        // Check if filename is provided and is a string
        // console.log(req.body);
        if (!filename) {
            return res.status(400).send({ message: "Filename is required" });
        }
       

        // Directly call uploadToS3Image with an empty buffer and filename
        const uploadUrl = await uploadToS3( path,filetype);
        console.log("Controller url : "+uploadUrl);

        res.status(200).send({ uploadUrl });
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).send({ message: "Failed to generate pre-signed URL" });
    }
}

module.exports = { generatePresignedUploadUrl };

/////////////////////////////////
// const { uploadToS3Image,s3Client } = require('../amazonS3/s3config');
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// const {s3} = require('../amazonS3/s3config');

// // Controller to directly call uploadToS3Image and return pre-signed URL
// async function generatePresignedUploadUrl(req, res) {
//     try {


//         const s3Params = {
//             Bucket:"cardealerbucket",
//             Key:req.query.filename,
//             Expires:60*60,
//             ContentType:req.query.mimetype
//         };
//         const url = await s3.getSignedUrl('putObject',s3Params);
//         res.json({url});

//     } catch (error) {
//         console.error("Error generating pre-signed URL:", error);
//         res.status(500).send({ message: "Failed to generate pre-signed URL" });
//     }
// }

// module.exports = { generatePresignedUploadUrl };