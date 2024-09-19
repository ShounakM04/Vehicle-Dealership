const express = require("express");
//const logResReq = require("./log"); // Import without destructuring
const fs = require("fs")
const port = 8000;
const app = express();

function logResReq(filename) {
    return (req, res, next) => {
        fs.appendFile(
            filename,
            `\n${Date.now()} : ${req.id} : ${req.method} : ${req.path}`,
            (err) => {
                if (err) {
                    console.error("Error writing to log file", err);
                }
                next();
            }
        );
    };
}

// Use JSON middleware if needed, otherwise remove it
app.use(express.json()); 

// Use your custom logging middleware
app.use(logResReq("logs.txt"));

// Define a simple GET route
app.get("/logs", (req, res) => {
    res.send("Hello");
});

// Correct `app.listen` without req and res parameters
app.listen(port, () => {
    console.log(`Server connected to port ${port}`);
});