const db = require("../models/database")

async function handleHomePage(req,res) {
    const {fuelType,carMake} = req.query;
    try{
        let query1 = `
        SELECT c.carname,c.registernumber,c.carcolor,c.carprice,ci.image_urls
        FROM cardetails c 
        JOIN images ci ON c.registernumber = ci.carNumber
        WHERE 1=1
         `;

        // Add conditions only when they exist
        if (fuelType) {
            query1 = query1 + ` AND c.fuel = '${fuelType}'`;
        }
        //console.log(query1);
        if (carMake) {
            query1 = query1 + ` AND c.carmake = '${carMake}'`;
        }
        //console.log(query1);


        query1 = query1 + ` ORDER BY c.registernumber`;

        const result = await db.query(query1);
            const carsWithImages = result.rows.map(row => ({
                registrationnumber: row.registernumber,
                imageurl: row.image_urls
            }));
            //console.log(carsWithImages);
            res.json({
                carsWithImages
             });
        
    }catch(error){
        console.log(`${error} : Error occured while loading images`);
    }  
}

module.exports = handleHomePage;