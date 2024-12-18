/////////////////////////// Already handled in carDetails Form


// const db = require("../models/database");
// async function handleInsuranceDetails(req, res) {
//     const {
//       registernumber,
//       insuranceCompany,
//       insuranceNumber,
//       insuranceValidity,
//       insuranceStartDate,
//       insuranceEndDate,
//       soldStatus,
//     } = req.body;
  
//     // Check for missing input data
//     if (
//       !registernumber ||
//       !insuranceCompany ||
//       !insuranceNumber ||
//       !insuranceValidity ||
//       !insuranceStartDate ||
//       !insuranceEndDate
//     ) {
//       console.log(req.body);
//       return res
//         .status(400)
//         .send("The data you have entered is incorrect. Please check again.");
//     }
  
//     try {
//         const documentUrls = await documentUpload(registernumber, req.files);

//         // Check if documents were successfully uploaded
//         if (documentUrls.length === 0) {
//           return res.status(401).send("Error uploading the documents.");
//         }
  
//       // Insert data into the carinsurance table
//       const query = `
//       INSERT INTO carinsurance (
//           registernumber, 
//           insurancecompany, 
//           insurancenumber, 
//           insurancetenure, 
//           insurancestartdate, 
//           insuranceenddate, 
//           soldstatus
//       ) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  
//       const values = [
//         registernumber,
//         insuranceCompany,
//         insuranceNumber,
//         insuranceValidity,
//         insuranceStartDate,
//         insuranceEndDate,
//         documentUrls, // Directly using the document URL/identifier
//         soldStatus,
//       ];
  
//       const result = await db.query(query, values);
//       if (!result) {
//         return res
//           .status(500)
//           .send("An unexpected error has occurred while inserting data.");
//       }
  
//       return res.status(200).send("Documents entered successfully.");
//     } catch (error) {
//       console.error(`${error}: An error occurred`);
//       return res.status(500).send("Unexpected error occurred.");
//     }
//   }
  
// async function handleGetInsuranceDetails(req, res) {
//   const registernumber = req.query.registernumber;
//   try {
//     if (!registernumber) {
//       return res.status(400).send("Enter the correct value");
//     }

//     const query = `SELECT * FROM carinsurance WHERE registernumber = $1`;
//     const value = [registernumber];
//     const result = await db.query(query, value);

//     if (result.rows.length === 0) {
//       return res.status(404).send("The Car Insurance Details Do Not Exist");
//     }

//     const insuranceData = result.rows[0];
//     return res.status(200).json({
//       registernumber: insuranceData.registernumber,
//       insurancecompany: insuranceData.insurancecompany,
//       insurancenumber: insuranceData.insurancenumber,
//       insurancetenure: insuranceData.insurancetenure,
//       insurancestartdate: insuranceData.insurancestartdate,
//       insuranceenddate: insuranceData.insuranceenddate,
//       insurancedocuments: insuranceData.insurancedocuments,
//       soldstatus: insuranceData.soldstatus
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server error");
//   }
// }

// module.exports = { handleInsuranceDetails, handleGetInsuranceDetails };
