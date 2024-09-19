const db = require("../models/database")

async function handleCarDetails(req,res) {
    const {registernum,carname,carmake,carcompany} = req.body;

    try{
        const query = `INSERT INTO cardetails (registernumber,carname,carmake,carcompany) VALUES ($1,$2,$3,$4)`
        const values = [registernum,carname,carmake,carcompany];
        db.query(query,values);
        res.status(200).send("Details entered into the database successfully");
    }
    catch(error){
        console.log(`${error} : Error occured in gathering the details`);
    }
    
}

module.exports = handleCarDetails;