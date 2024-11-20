const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('html-pdf');
const db = require("../models/database");

async function generateBill(req, res) {
    const { registerNumber } = req.body;
    console.log("Request body:", req.body);


    try {
        // Query car details
        console.log(1);
        const carDetailsQuery = `SELECT * FROM cardetails WHERE registernumber = ($1)`;
        const result = await db.query(carDetailsQuery,[registerNumber]);
        console.log(2);

        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Car details not found for the given registration number" });
        }

        // Query car insurance details
        console.log(3);

        const carInsuranceQuery = `SELECT * FROM carinsurance WHERE registernum = $1`;
        const result1 = await db.query(carInsuranceQuery, [registerNumber]);

        if (result1.rowCount === 0) {
            return res.status(404).send({ message: "Car insurance details not found for the given registration number" });
        }
        console.log(4);

        // Query customer details (who bought the car)
        const customerDetailsQuery = `SELECT * FROM soldcardetails WHERE registernumber = $1`;
        const result2 = await db.query(customerDetailsQuery, [registerNumber]);

        if (result2.rowCount === 0) {
            return res.status(404).send({ message: "Customer details not found for the given registration number" });
        }
        console.log(5);

        // Extract data from queries
        const carDetails = result.rows[0];
        const carinsurance = result1.rows[0];
        const customerDetails = result2.rows[0];
        console.log(6);

        // Load and compile the Handlebars template
        const templatePath = path.join(__dirname, '../template/billTemplate.hbs');
        const template = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(template);
        console.log(7);

        // Generate HTML with data
        const html = compiledTemplate({ carDetails, carinsurance, customerDetails });

        // PDF options
        const options = { format: 'A4', orientation: 'portrait' };

        // Generate PDF and send it as a response
        pdf.create(html, options).toFile('bill.pdf', (err, result) => {
            if (err) return res.status(500).send({ message: "Error generating PDF" });

            // Send the PDF file as a response for download
            res.sendFile(result.filename    );
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { generateBill };
