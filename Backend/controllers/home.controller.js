const db = require("../models/database");

async function handleHomePage(req, res) {
    const { fuelType, carMake, carSearch } = req.query; // Extract parameters from query
    try {
        let query1 = `
        SELECT c.carname, c.registernumber, c.carcolor, c.carprice, c.status, ci.image_urls, ci.display_image
        FROM cardetails c 
        JOIN images ci ON c.registernumber = ci.carNumber
        WHERE 1=1
        `;
        
        // Add condition for fuelType
        if (fuelType) {
            query1 += ` AND c.fuel = '${fuelType}'`;
        }

        // Add condition for carMake
        if (carMake) {
            query1 += ` AND c.carmake = '${carMake}'`;
        }
        
        // Add condition for carSearch to check both carname and registernumber
        if (carSearch) {
            query1 += ` AND (LOWER(c.carname) LIKE LOWER('%${carSearch}%') OR LOWER(c.registernumber) LIKE LOWER('%${carSearch}%'))`; 
        }

        query1 += ` ORDER BY c.registernumber`;

        const result = await db.query(query1);
        const carsWithImages = result.rows.map(row => ({
            registrationnumber: row.registernumber,
            carname: row.carname,
            carprice: row.carprice,
            imageurl: row.image_urls,
            status: row.status,
            displayImage: row.display_image
        }));

        res.json({
            carsWithImages
        });

    } catch (error) {
        console.log(`${error} : Error occurred while loading images`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = handleHomePage;
