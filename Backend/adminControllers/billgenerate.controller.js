const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('html-pdf');
const db = require("../models/database.js");  // Assuming you have a file to handle DB connections

// Your S3 bucket name
const BUCKET_NAME = 'cardealerbucket';  // No longer needed in this case

async function generateBill(req, res) {
    const { registerNumber } = req.body;
    console.log("Request body:", req.body);

    try {
        // Query car details
        const carDetailsQuery = `SELECT * FROM cardetails WHERE registernumber = ($1)`;
        const result = await db.query(carDetailsQuery, [registerNumber]);

        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Car details not found for the given registration number" });
        }

        // Query car insurance details
        const carInsuranceQuery = `SELECT * FROM carinsurance WHERE registernumber = $1`;
        const result1 = await db.query(carInsuranceQuery, [registerNumber]);

        if (result1.rowCount === 0) {
            return res.status(404).send({ message: "Car insurance details not found for the given registration number" });
        }

        // Query customer details (who bought the car)
        const customerDetailsQuery = `SELECT * FROM soldcardetails WHERE registernumber = $1`;
        const result2 = await db.query(customerDetailsQuery, [registerNumber]);

        if (result2.rowCount === 0) {
            return res.status(404).send({ message: "Customer details not found for the given registration number" });
        }

        const ownerDetailsQuery = `SELECT * FROM ownerdetails WHERE registernumber = $1`;
        const result3 = await db.query(ownerDetailsQuery, [registerNumber]);

        if (result3.rowCount === 0) {
            return res.status(404).send({ message: "Owner details not found for the given registration number" });
        }

        // Extract data from queries
        const carDetails = result.rows[0];
        const carinsurance = result1.rows[0];
        const customerDetails = result2.rows[0];
        const ownerDetails = result3.rows[0];
        console.log("carDetails: ",carDetails)
        console.log("carinsurance: ",carinsurance)
        console.log("customerDetails: ",customerDetails)
        console.log("OwnerDetails: ",ownerDetails)

        // Load and compile the Handlebars template
        // const templatePath = path.join(__dirname, '../template/billTemplate.hbs');
        const templatePath = path.join(process.cwd(), 'public/template/billTemplate.hbs');

        const template = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(template);

        // Generate HTML with data
        const html = compiledTemplate({ carDetails, carinsurance, customerDetails, ownerDetails});

        // PDF options
        const options = { format: 'A4', orientation: 'portrait' };

        // Generate PDF buffer (in memory)
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).send({ message: "Error generating PDF" });
            }

            // Set headers to force download
            res.setHeader('Content-Disposition', `attachment; filename=${registerNumber}_bill.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', buffer.length);

            // Send the buffer as the response (this will trigger a download)
            res.send(buffer);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { generateBill };
