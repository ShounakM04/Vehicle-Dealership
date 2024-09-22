const db = require("../models/database")

async function handleSpecifiPage(req,res) {
    try{
        const regisNum = req.params.registrationnumber;
        console.log(regisNum)
        const values = [regisNum];
        const query1 = `select * from cardetails where registernumber = $1`
        const detailsResult = await db.query(query1,values);

        const query2 = `select imageurl from carimages where registernumber = ($1)`
        const imageResults = await db.query(query2,values);

        const query3 = `select * from carinsurance where registernumber = ($1)`;
        const insuranceResults = await db.query(query3,values);

        const query4 = `select * from ownerdetails where registernumber = ($1)`
        const ownerResults = await db.query(query4,values);

        if(detailsResult.rows.length >0 ){
            const car = detailsResult.rows[0];
            const images = imageResults.rows;
            const insurance = insuranceResults.rows[0];
            const owner = ownerResults.rows[0];
            console.log(car);


            res.render("specificCar",{car,images,insurance,owner});
        }else{
            res.status(400).send("Car not found");
        }
    }
    catch(error){
        console.log(`Error occured : ${error}`);
    }
    


    //res.send("Specific Car Details Page");
}

module.exports = handleSpecifiPage;