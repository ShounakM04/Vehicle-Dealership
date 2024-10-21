const db = require("../models/database")
const cloudin = require('../controllers/cloud.controller');

async function handleGetMaintainanceDetails(req, res) {
    const registerNumber = req.query.registerNumber;
    console.log("yeh le", registerNumber);

    try {
        //console.log(registerNumber);
        if (!registerNumber) {
            return res.status(400).send("Enter a car registration number");
        }

        const query = `SELECT * FROM maintainancedetails WHERE registernumber = $1`;
        const value = [registerNumber];
        const result = await db.query(query, value);

        //console.log(result.rows[0]);
        if (result.rows.length == 0) {
            return res.status(400).send("The car does not exist in the system");
        }

        const query1 = `SELECT SUM(maintainancecost) FROM maintainancedetails WHERE registernumber = $1`;
        const value1 = [registerNumber];
        const totCost = await db.query(query1, value1);

        const maintainanceDetails = result.rows[0];
        const totalCost = totCost.rows[0];

        return res.status(200).json({
            registerNumber: maintainanceDetails.registernumber,
            maintainanceType: maintainanceDetails.maintainancedetails,
            maintainanceCost: maintainanceDetails.maintainancecost,
            maintainancedate: maintainanceDetails.maintainancedate,
            doneby: maintainanceDetails.maintainancedone,
            maintainanceReceipt: maintainanceDetails.maintainancereceipt,
            totalmaintainance: totalCost.sum,
        });


    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
}


async function handlePostMaintainanceDetails(req, res) {
    const { registerNumber, maintainanceType, maintainanceCost, maintainancedate, doneby } = req.body;
    if (!registerNumber || !maintainanceType || !maintainanceCost || !maintainancedate || !maintainancedate || !doneby) {
        return res.status(404).send("Enter all the details correctly");
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).send("Please upload the document(s) correctly.");
    }
    try {
        const maintainanceReceipts = [];

        for (const doc of req.files) {
            const path = doc.path;
            const result = await cloudin(path); // Upload document to Cloudinary
            const docResult = result.secure_url;
            maintainanceReceipts.push(docResult); // Store secure URLs
        }

        // Check if documents were successfully uploaded
        if (maintainanceReceipts.length === 0) {
            return res.status(401).send("Error uploading the documents.");
        }

        const query = `INSERT INTO maintainancedetails 
                        (registernumber,maintainancecost,maintainancedetails,maintainancedate,maintainancereceipt,maintainancedone)
                        VALUES ($1,$2,$3,$4,$5,$6)`;
        const values = [registerNumber, maintainanceCost, maintainanceType, maintainancedate, maintainanceReceipts, doneby];
        const result = await db.query(query, values);

        if (result.rows.length == 0) {
            return res.status(400).send("Error occured in entering the details");
        }

        res.status(200).send("Details Entered Successfully");


    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    handleGetMaintainanceDetails,
    handlePostMaintainanceDetails
}