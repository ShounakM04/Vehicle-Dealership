const db = require("../models/database")
const cloudin = require('../controllers/cloudController')


async function handleInsuranceDetails(req,res) {
    const {registerNumber, insuranceCompany, insuranceNumber, insuranceValidity, insuranceStartDate, insuranceEndDate} = req.body; 
    
    if(!registerNumber || !insuranceCompany || !insuranceNumber || !insuranceValidity || !insuranceEndDate || !insuranceStartDate){
        return res.status(400).send("The data you have entered in incorrect please check again");
    }   
    if(!req.files){
        return res.status(400).send("Enter the document correctly");
    }

    try{
        documentUrls = []
        for(doc of req.files){
            const path = doc.path;
            const result = await cloudin(path);
            docResult = result.secure_url;
            documentUrls.push(docResult);
        }

        if(documentUrls == []){
            return res.status(401).send("Error uploading the docs")
        }
        const query = `INSERT INTO carinsurance VALUES ($1,$2,$3,$4,$5,$6)`;
        const values = [registerNumber, insuranceCompany, insuranceNumber, insuranceValidity, insuranceStartDate, insuranceEndDate,documentUrls];
        const result = await db.query(query,values);

        if(!result){
            res.error(500).send("An unexpected error has occured");
        }

        return res.status(200).send("Documents entered successfully");
    }catch(error){
        console.log(`${error} : error occured`);
        return  res.status(500).send("Unexpected error occured");
    }
}


module.exports = handleInsuranceDetails;