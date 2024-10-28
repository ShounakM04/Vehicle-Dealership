const { uploadToS3Image } = require('../amazonS3/s3config');

// Controller to directly call uploadToS3Image and return pre-signed URL
async function generatePresignedUploadUrl(req, res) {
    try {
        const { fileName } = req.body; // Expect filename from the request body

        // Check if filename is provided and is a string
        console.log(req.body);
        if (!fileName || typeof fileName !== 'string') {
            return res.status(400).send({ message: "Filename is required and must be a string" });
        }

        // Directly call uploadToS3Image with an empty buffer and filename
        const uploadUrl = await uploadToS3Image(Buffer.from(''), fileName);
        console.log("Controller url : "+uploadUrl);

        res.status(200).send({ uploadUrl });
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).send({ message: "Failed to generate pre-signed URL" });
    }
}

module.exports = { generatePresignedUploadUrl };