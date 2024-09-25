const db = require("../models/database")

async function handleCarDetails(req,res) {
    const {registernum,carname,carmake,carcompany,carcolor,carprice} = req.body;
    const {insuranceCompany,policyNumber,policyTenure} = req.body;
    const {ownerName,ownerContact,ownerEmail,ownerAddress }= req.body;
    console.log(req.body);
    try{
        const query = `INSERT INTO cardetails (registernumber,carname,carmake,carcompany,carcolor,carprice) VALUES ($1,$2,$3,$4,$5,$6)`
        const values = [registernum,carname,carmake,carcompany,carcolor,carprice];
        await db.query(query,values);

        const query1 = `INSERT INTO carinsurance (registernumber,companyname,policynum,policytenure) VALUES ($1,$2,$3,$4)`
        const values1= [registernum,insuranceCompany,policyNumber,policyTenure]
         db.query(query1,values1);
        
        const query2 = `INSERT INTO ownerdetails (ownername,ownerphone,owneremail,owneraddress,registernumber) VALUES ($1,$2,$3,$4,$5)`
        const values2= [ownerName,ownerContact,ownerEmail,ownerAddress,registernum]
         db.query(query2,values2);

        res.status(200).send("Details entered into the database successfully");
    }
    catch(error){
        console.log(`${error} : Error occured in gathering the details`);
    }
    
}

module.exports = handleCarDetails;