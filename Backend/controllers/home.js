const db = require("../models/database");

async function handleHomePage(req, res) {
    try {
        const result = await db.query(`
            SELECT DISTINCT ON (c.registernumber) c.registernumber, c.carname, c.carprice, ci.imageurl 
            FROM cardetails c
            JOIN carimages ci ON c.registernumber = ci.registernumber
            ORDER BY c.registernumber
        `);
        
        const carsWithImages = result.rows.map(row => ({
            registrationnumber: row.registernumber,
            carname: row.carname,
            carprice: row.carprice,
            imageurl: row.imageurl
        }));
        
        res.json(carsWithImages); // Return JSON data with carname and carprice
    } catch (error) {
        console.log(`${error} : Error occurred while loading images`);
        res.status(500).json({ error: "Internal Server Error" }); // Return an error response
    }
}

module.exports = handleHomePage;
