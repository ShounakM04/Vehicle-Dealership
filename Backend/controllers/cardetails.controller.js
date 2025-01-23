const db = require("../models/database");

async function  handleCarDetails(req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({ error: "Request body is empty" });
    }

    const {
      registernumber,
      vehicleName,
      brandName,
      insuranceCompany,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerAddress,
      vehicleColor,
      vehicleBuyPrice,
      vehicleSellPrice,
      vehicleType,
      fuel,
      insuranceNumber,
      insuranceTenure,
      insuranceStartDate,
      insuranceEndDate,
      showInsuranceFields,
      showOwnerFields,
      soldStatus,
      onhomepage,
      fitness_upto_date,
      registration_date,
      description,
      kilometers,

      company_name, 
      branch_name, 
      manager_name1,
      contact1,    
      manager_name2,
      contact2, 
    } = req.body;

    // Validate mandatory fields
    const requiredFields = {
      registernumber,
      vehicleName,
      fuel,
      vehicleType,
    };



    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.toString().trim() === "") {
        return res.status(400).send({ error: `${field} is required and cannot be empty` });
      }
    }

    // Ensure carPrice is a positive number
    // if (vehicleBuyPrice <= 0) {
    //   return res.status(400).send({ error: "Car price must be a positive number" });
    // }

    // Validate specific formats if needed
    if (showOwnerFields && ownerPhone && !/^\d{10}$/.test(ownerPhone)) {
      return res.status(400).send({ error: "Owner phone must be a valid 10-digit number" });
    }

    if (showOwnerFields && ownerEmail && !/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(ownerEmail)) {
      return res.status(400).send({ error: "Owner email is invalid" });
    }

    // Check if registration number already exists
    const query = `SELECT * FROM cardetails WHERE registernumber = $1`;
    const values = [registernumber];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).send({ error: "Registration number already exists. Please enter a unique registration number." });
    }

    // Insert car details
    const query2 = `INSERT INTO cardetails (registernumber, carname, carmake, carcompany, carcolor, vehiclebuyprice, fuel,vehiclesellprice,onhomepage,kilometers,fitness_upto_date,registration_date,description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;

    const values2 = [registernumber, vehicleName || "Not Provided", vehicleType || "Not Provided", brandName || "Not Provided", vehicleColor || "Not Provided", vehicleBuyPrice || 0, fuel || "Not Provided", vehicleSellPrice || 0, onhomepage || false ,kilometers || 0,fitness_upto_date || null,registration_date || null,description || "Not Provided"];


    await db.query(query2, values2);

    let values3 = [
      registernumber,
      insuranceCompany || "Not Provided",
      insuranceNumber || "Not Provided",
      insuranceTenure || 0,
      insuranceStartDate || null,
      insuranceEndDate || null,
      soldStatus || false, // set default soldStatus to false if not provided
    ];
    if (showInsuranceFields == true) {
      values3 = [
        registernumber,
        insuranceCompany || "Not Provided",
        insuranceNumber || "Not Provided",
        insuranceTenure || 0,
        insuranceStartDate || null,
        insuranceEndDate || null,
        soldStatus || false, // set default soldStatus to false if not provided


      ];



    }
    // Insert insurance details
    const query3 = `
    INSERT INTO carinsurance (
      registernumber, 
      insurancecompany, 
      insurancenumber, 
      insurancetenure, 
      insurancestartdate, 
      insuranceenddate, 
      soldstatus
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    await db.query(query3, values3);

    // Insert owner details
    const query4 = `INSERT INTO ownerdetails (ownername, ownerphone, owneremail, owneraddress, registernumber) VALUES ($1, $2, $3, $4, $5)`;

    let values4;
    if (showOwnerFields == true) {


      values4 = [ownerName, ownerPhone, ownerEmail, ownerAddress, registernumber];
    }
    else {
      values4 = ["Nikhil Motors", "7058600679", "nikhilmotors@gmail.com", "Halondi, Kolhapur", registernumber];
    }

    await db.query(query4, values4);
    const query5 = `INSERT INTO finance (company_name, branch_name, manager_name1, contact1, manager_name2, contact2, registernumber) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values5 = [
      company_name || "Not Provided",
      branch_name || "Not Provided",
      manager_name1 || "Not Provided",
      contact1 || "Not Provided",
      manager_name2 || "Not Provided",
      contact2 || "Not Provided",
      registernumber,
    ];

    await db.query(query5, values5);
    
    res.status(200).send("Vehicle Details entered successfully");
  } catch (error) {
    // Log error for debugging
    console.error(`Error: ${error.message}`);

    // Send a generic error message to the frontend
    res.status(500).send({ error: `An error occurred while saving details ${error.message}`});
  }
}

module.exports = handleCarDetails;
