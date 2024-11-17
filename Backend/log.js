// const fs = require("fs");

// function logResReq(filename) {
//     return (req, res, next) => {
//         fs.appendFile(
//             filename,
//             `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}`,
//             (err) => {
//                 if (err) {
//                     console.error("Error writing to log file", err);
//                 }
//                 next();
//             }
//         );
//     };
// }

// module.exports = logResReq; // Export the function correctly


const fs = require("fs");

function logResReq(filename) {
    return (req, res, next) => {
        // Capture the user (or anonymous if not available)
        // console.log(req)
        const user = req.user ? req.user.username : 'Anonymous';
        // console.log("Inside log.js", user)
        const timestamp = new Date().toISOString();
        // Log for POST requests to `/details` route
        if (req.method === 'POST' && req.path.includes('/details')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';  // Capture vehicle number
            const timestamp = new Date().toISOString(); // Standard readable timestamp
            const logMessage = `${user} has added a vehicle with number: ${vehicleNumber}`;
            // Write the log entry to the file
            fs.appendFile(
                filename,
                `\n${timestamp} : ${logMessage}`,
                (err) => {
                    if (err) {
                        console.error("Error writing to log file", err);
                    }
                    next();
                }
            );
        }
        // Log for POST requests to `/maintenance` route
        else if (req.method === 'POST' && req.path.includes('/maintainance')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';  // Capture vehicle number
            const timestamp = new Date().toISOString(); // Standard readable timestamp
            const logMessage = `${user} has added maintenance for vehicle number: ${vehicleNumber}`;

            // Write the log entry to the file
            fs.appendFile(
                filename,
                `\n${timestamp} : ${logMessage}`,
                (err) => {
                    if (err) {
                        console.error("Error writing to log file", err);
                    }
                    next();
                }
            );
        }
        else if (req.method === 'POST' && req.path.includes('/installments')) {
            const vehicleNumber = req.body.registernumber || 'Unknown';  // Capture vehicle number
            const logMessage = `${user} has added an installment for vehicle number: ${vehicleNumber}`;
            fs.appendFile(filename, `\n${timestamp} : ${logMessage}`, (err) => {
                if (err) console.error("Error writing to log file", err);
                next();
            });
        }
        else {
            next();  // Skip logging for other routes/methods
        }
    };
}

module.exports = logResReq;
