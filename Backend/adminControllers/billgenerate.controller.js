const { PDFDocument } = require('pdf-lib');
const db = require("../models/database.js");

async function generateBill(req, res) {
    const { registerNumber } = req.body;

    try {
        // Query car details from the database
        const carDetailsQuery = `SELECT * FROM cardetails WHERE registernumber = $1`;
        const carDetailsResult = await db.query(carDetailsQuery, [registerNumber]);
        if (carDetailsResult.rowCount === 0) return res.status(404).send({ message: "Car details not found" });

        const carDetails = carDetailsResult.rows[0];

        // Query car insurance details from the database
        const carInsuranceQuery = `SELECT * FROM carinsurance WHERE registernumber = $1`;
        const insuranceResult = await db.query(carInsuranceQuery, [registerNumber]);
        const carinsurance = insuranceResult.rowCount ? insuranceResult.rows[0] : {};

        // Query customer details (who bought the car)
        const customerDetailsQuery = `SELECT * FROM soldcardetails WHERE registernumber = $1`;
        const customerResult = await db.query(customerDetailsQuery, [registerNumber]);
        const customerDetails = customerResult.rowCount ? customerResult.rows[0] : {};

        // Query owner details from the database
        const ownerDetailsQuery = `SELECT * FROM ownerdetails WHERE registernumber = $1`;
        const ownerResult = await db.query(ownerDetailsQuery, [registerNumber]);
        const ownerDetails = ownerResult.rowCount ? ownerResult.rows[0] : {};

        // Create a new PDF document using pdf-lib
        const pdfDoc = await PDFDocument.create();

        // Add a page to the PDF
        const page = pdfDoc.addPage([600, 800]); // A4 page size
        const { width, height } = page.getSize();

        // Add title and car details to the PDF
        page.drawText(`Customer Bill`, { x: 200, y: height - 50, size: 24, color: rgb(0, 0, 0) });

        // Vehicle Details
        page.drawText(`Registration Number: ${carDetails.registernumber}`, { x: 50, y: height - 100, size: 12 });
        page.drawText(`Vehicle Name: ${carDetails.carname}`, { x: 50, y: height - 120, size: 12 });
        page.drawText(`Car Make: ${carDetails.carmake}`, { x: 50, y: height - 140, size: 12 });
        page.drawText(`Car Company: ${carDetails.carcompany}`, { x: 50, y: height - 160, size: 12 });
        page.drawText(`Car Color: ${carDetails.carcolor}`, { x: 50, y: height - 180, size: 12 });
        page.drawText(`Fuel Type: ${carDetails.fuel}`, { x: 50, y: height - 200, size: 12 });
        page.drawText(`Sell Price: ₹${carDetails.vehiclesellprice}`, { x: 50, y: height - 220, size: 12 });

        // Customer Details
        page.drawText(`Customer Owner Name: ${customerDetails.owner_name}`, { x: 50, y: height - 260, size: 12 });
        page.drawText(`Customer Contact Number: ${customerDetails.contact_no}`, { x: 50, y: height - 280, size: 12 });
        page.drawText(`Customer Down Payment: ₹${customerDetails.down_payment}`, { x: 50, y: height - 300, size: 12 });
        page.drawText(`Customer Commission: ₹${customerDetails.commission}`, { x: 50, y: height - 320, size: 12 });

        // Owner Details
        page.drawText(`Owner Name: ${ownerDetails.ownername}`, { x: 50, y: height - 360, size: 12 });
        page.drawText(`Owner Contact Number: ${ownerDetails.ownerphone}`, { x: 50, y: height - 380, size: 12 });
        page.drawText(`Owner Email: ${ownerDetails.owneremail}`, { x: 50, y: height - 400, size: 12 });
        page.drawText(`Owner Address: ${ownerDetails.owneraddress}`, { x: 50, y: height - 420, size: 12 });

        // Additional Details (Handover and Signatures)
        page.drawText(`Date of Handover: ___________________________`, { x: 50, y: height - 460, size: 12 });
        page.drawText(`Witness 1: Signature: ______________________`, { x: 50, y: height - 480, size: 12 });
        page.drawText(`Witness 2: Signature: ______________________`, { x: 50, y: height - 500, size: 12 });
        page.drawText(`Car Buyer: Signature: ______________________`, { x: 50, y: height - 520, size: 12 });
        page.drawText(`Car Seller: Signature: ______________________`, { x: 50, y: height - 540, size: 12 });

        // Serialize the PDF document to bytes
        const pdfBytes = await pdfDoc.save();

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename=${registerNumber}_bill.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBytes.length);

        // Send the PDF as the response
        res.send(pdfBytes);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { generateBill };
