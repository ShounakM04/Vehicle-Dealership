const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const { format, subDays } = require('date-fns');
const cron = require("node-cron");

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY,
        secretAccessKey: process.env.AMAZON_SECRET_KEY,
    },
});

// Function to delete logs from S3 for two days ago
async function deleteOldLogs(bucketName) {
    const twoDaysAgoDate = format(subDays(new Date(), 2), 'yyyy-MM-dd');
    const filename = `logs/${twoDaysAgoDate}.csv`;

    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: filename,
        });
        await s3Client.send(command);
        console.log(`Log file for ${twoDaysAgoDate} deleted successfully.`);
    } catch (error) {
        if (error.name !== 'NoSuchKey') {
            console.error(`Error deleting log file for ${twoDaysAgoDate}:`, error);
            throw error;
        } else {
            console.log(`Log file for ${twoDaysAgoDate} does not exist.`);
        }
    }
}

// Function to create an empty log file every day at midnight
async function createDefaultLogFile() {
    const todayDate = format(new Date(), 'yyyy-MM-dd'); // Today's date
    const bucketName = "cardealerbucket";
    const filename = `logs/${todayDate}.csv`; // Daily log file
    const emptyContent = "Timestamp,Message"; // Header for the CSV file

    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: emptyContent,
            ContentType: "text/csv",
        });

        console.log(`Creating default log file for ${todayDate}...`);
        await s3Client.send(command);
        console.log(`Default log file created: ${filename}`);
    } catch (error) {
        console.error(`Failed to create default log file for ${todayDate}:`, error);
        throw error;
    }
}

// Schedule the task to run daily at midnight
cron.schedule("0 0 * * *", () => {
    createDefaultLogFile();
});

// Function to upload or append logs to the S3 file
async function appendLogToS3(bucketName, filename, logEntry) {
    try {
        let currentContent = '';
        // console.log("appendLogToS3 called");

        // Try to retrieve the existing file contents (if it exists)
        try {
            const command = new GetObjectCommand({ Bucket: bucketName, Key: filename });
            const response = await s3Client.send(command);
            currentContent = await response.Body.transformToString();
            // console.log(`Current Content: ${currentContent}`);
        } catch (error) {
            // If file doesn't exist, we proceed without fetching any content
            if (error.name !== 'NoSuchKey') {
                console.error("Error fetching log file: ", error);
                throw error;
            }
            console.log(`Log file does not exist yet, creating a new one.`);
        }

        // Append the new log entry to the current content
        const updatedContent = currentContent + `\n${logEntry}`;
        // console.log(`Updated Content to Upload: ${updatedContent}`);

        // Upload the updated content back to S3
        const uploadCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: updatedContent,
            ContentType: "text/csv",
        });

        console.log("Uploading log to S3...");
        await s3Client.send(uploadCommand);
        console.log(`Log uploaded to S3: ${filename}`);
    } catch (error) {
        console.error("Error uploading log to S3:", error);
        throw error;
    }
}

function logResReq() {
    return async (req, res, next) => {
        // console.log("logResReq middleware triggered");
        const user = req?.user ? req?.user?.username : 'Anonymous';
        // console.log("User:", user);

        // Convert to IST (UTC+5:30)
        const currentDate = new Date();
        const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000)); // Offset by 5 hours and 30 minutes
        const timestamp = istDate.toISOString().replace('T', ' ').split('.')[0]; // Format timestamp without milliseconds
        
        const bucketName = "cardealerbucket";
        const filename = `logs/${timestamp.split(" ")[0]}.csv`; // Using date portion only

        let logMessage = '';
        if (req.method === 'POST' && req.path.includes('/details')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';
            logMessage = `${timestamp} : ${user} added a vehicle with number: ${vehicleNumber}`;
        } else if (req.method === 'POST' && req.path.includes('/maintainance')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';
            logMessage = `${timestamp} : ${user} added maintenance for vehicle number: ${vehicleNumber}`;
        } else if (req.method === 'POST' && req.path.includes('/installments')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';
            logMessage = `${timestamp} : ${user} added an installment for vehicle number: ${vehicleNumber}`;
        } else if (req.method === 'DELETE' && req.path.includes('/delete/car')) {
            console.log(req.path)
            const vehicleNumber = req.query.deletedID || 'Unknown';
            logMessage = `${timestamp} : ${user} deleted vehicle with vehicle number: ${vehicleNumber}`;
        } else if (req.method === 'POST' && req.path.includes('/customer')) {
            logMessage = `${timestamp} : ${user} added Customer query`;
        } else if (req.method === 'DELETE' && req.path.includes('customer')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';
            logMessage = `${timestamp} : ${user} deleted Customer query`;
        } else if (req.method === 'POST' && req.path.includes('/edit-fields')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';
            logMessage = `${timestamp} : ${user} edited fields for vehicle number: ${vehicleNumber}`;
        } else if (req.method === 'POST' && req.path.includes('/miscellaneous-costs/add')) {
            logMessage = `${timestamp} : ${user} added miscellaneous costs`;
        } else if (req.method === 'POST' && req.path.includes('/dashboard/sell-car')) {
            const vehicleNumber = req.body.carID || 'Unknown';
            logMessage = `${timestamp} : ${user} sold vehicle with vehicle number: ${vehicleNumber}`;
        } else if (req.method === 'POST' && req.path.includes('/dashboard/delete-notice')) {
            logMessage = `${timestamp} : ${user} deleted notice image`;
        } else if (req.method === 'POST' && req.path.includes('/accountDetails')){
            logMessage = `${timestamp} : ${user} added an investment`;
        } else if (req.method === 'POST' && req.path.includes('/edit-fields')){
            logMessage = `${timestamp} : ${user} edited fields of vehicle details`;
        } else if (req.method === 'POST' && req.path.includes('/miscellaneous-costs/add')){
            logMessage = `${timestamp} : ${user} Added miscellaneous costs`;
        }

        // console.log("Log Message:", logMessage);

        // Call the deleteOldLogs function to remove logs from two days ago
        try {
            await deleteOldLogs(bucketName);
        } catch (error) {
            console.error("Failed to delete old logs:", error);
        }

        // Only append logs if a valid log message is created
        if (logMessage) {
            try {
                await appendLogToS3(bucketName, filename, logMessage);
            } catch (error) {
                console.error("Failed to upload log:", error);
            }
        }

        next(); // Ensure next() is always called, even if there's no log message
    };
}

module.exports = logResReq;
