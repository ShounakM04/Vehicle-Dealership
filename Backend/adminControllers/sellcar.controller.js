
const db = require("../models/database");
const { imageUpload } = require('../utils/uploadFunctions.js');

async function handleSellCar(req, res) {
    try {

        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        // Destructure fields from form data in req.body.formData
        const {
            carID,
            sellingPrice,
            ownerName,
            contactNo,
            downPayment,
            totalInstallments,
            installmentAmount,
            commission
        } = req.body;

        console.log("In controller: CarID - " + carID);

        // Upload insurance document if provided
        const insuranceImageUrls = req.files['insuranceDocument']
            ? await imageUpload(carID, [req.files['insuranceDocument'][0]])
            : [];

        // Upload car photos if provided
        const carImageUrls = req.files['carPhoto']
            ? await imageUpload(carID, req.files['carPhoto'])
            : [];

        // Extract URLs for the insurance document and car images
        const insImageUrl = insuranceImageUrls.length > 0 ? insuranceImageUrls[0] : null;
        const imageUrls = carImageUrls.length > 0 ? carImageUrls : null;

        console.log("Insurance Image URL:", insImageUrl);
        console.log("Car Image URLs:", imageUrls);

        // Update car status to sold in the cardetails table
        const updateQuery = `UPDATE cardetails SET status = true WHERE registernumber = $1`;
        await db.query(updateQuery, [carID]);

        // Insert data into the soldcardetails table, including the URLs
        await db.query(
            `INSERT INTO soldcardetails (
                registernumber, selling_price, owner_name, contact_no, 
                down_payment, total_installments, installment_amount, commission, insurance_image, vehicle_image
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [
                carID,
                sellingPrice,
                ownerName,
                contactNo,
                downPayment,
                totalInstallments,
                installmentAmount,
                commission,
                insImageUrl,
                imageUrls
            ]
        );

        res.status(200).json({ message: 'Car sold successfully!' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function getSoldCarDetails(req, res) {
    try {
        // If a specific car ID is provided, fetch details for that car only
        const { carID } = req.query;
        
        let query = `SELECT * FROM soldcardetails`;
        const params = [];

        if (carID) {
            query += ` WHERE registernumber = $1`;
            params.push(carID);
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching sold car details:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { handleSellCar, getSoldCarDetails };
