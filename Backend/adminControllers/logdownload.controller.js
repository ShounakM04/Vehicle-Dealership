const fs = require('fs'); // Use regular fs for streaming
const fsPromises = require('fs').promises; // Use fs.promises for async file checks
const path = require('path');

const downloadLogFile = async (req, res) => {
    try {
        // Get today's date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Define the log file path
        const logFilePath = path.join(__dirname, `../user_activity_log.csv`);

        // Check if the log file exists asynchronously using fs.promises
        try {
            await fsPromises.access(logFilePath); // This will throw if the file doesn't exist
        } catch (error) {
            // If the file does not exist, return a 404 response
            return res.status(404).json({ message: 'Log file not found for today.' });
        }

        // Set the response headers to indicate file download
        res.setHeader('Content-Disposition', `attachment; filename=user_activity_log_${currentDate}.csv`);
        res.setHeader('Content-Type', 'text/csv');

        // Pipe the CSV file to the response stream using regular fs
        const fileStream = fs.createReadStream(logFilePath);
        fileStream.pipe(res);

        // Handle error if file reading fails
        fileStream.on('error', (err) => {
            console.error('Error reading the log file:', err);
            res.status(500).json({ message: 'Error reading the log file.' });
        });
        
    } catch (error) {
        console.error('Error downloading log file:', error);
        res.status(500).json({ message: 'Server error while processing the request.' });
    }
};

module.exports = downloadLogFile;
