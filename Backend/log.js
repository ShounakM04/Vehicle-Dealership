// const fs = require("fs");
import fs from "fs";

function logResReq(filename) {
    return (req, res, next) => {
        fs.appendFile(
            filename,
            `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}`,
            (err) => {
                if (err) {
                    console.error("Error writing to log file", err);
                }
                next();
            }
        );
    };
}
 // Export the function correctly
export default {logResReq}