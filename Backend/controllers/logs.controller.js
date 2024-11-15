const fs = require('fs');
const path = require('path');

function getLogsForToday(req, res) {
    const logFile = './user_activity_log.csv';
    fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading log file");
        }
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="user_activity_log.csv"');
        res.send(data);
    });
}

module.exports = { getLogsForToday };
