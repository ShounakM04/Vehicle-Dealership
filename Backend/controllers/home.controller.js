const db = require("../models/database");

async function handleHomePage(req, res) {
    const { fuelType, carMake, carname } = req.query; // Extract carname from query parameters
    // console.log(fuelType, carMake, carname); // Optional for debugging
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
        
        // Add condition for carname
        if (carname) {
            query1 += ` AND LOWER(c.carname) LIKE LOWER('%${carname}%')`; // Case-insensitive search
        }

        // console.log(query1); // Optional for debugging

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
        res.status(500).json({ error: "Internal Server Error" }); // Return an error response
    }
}

module.exports = handleHomePage;


// const db = require("../models/database")

// async function handleHomePage(req,res) {
//     const {fuelType,carMake} = req.query;
//     try{
//         let query1 = `
//         SELECT c.carname,c.registernumber,c.carcolor,c.carprice,ci.image_urls
//         FROM cardetails c 
//         JOIN images ci ON c.registernumber = ci.carNumber
//         WHERE 1=1
//          `;

//         // Add conditions only when they exist
//         if (fuelType) {
//             query1 = query1 + ` AND c.fuel = '${fuelType}'`;
//         }
//         //console.log(query1);
//         if (carMake) {
//             query1 = query1 + ` AND c.carmake = '${carMake}'`;
//         }
//         //console.log(query1);


//         query1 = query1 + ` ORDER BY c.registernumber`;

//         const result = await db.query(query1);
//             const carsWithImages = result.rows.map(row => ({
//                 registrationnumber: row.registernumber,
//                 imageurl: row.image_urls,
//                 carprice: row.carprice,
//                 carname: row.carname

//             }));
//             //console.log(carsWithImages);
//             res.json({
//                 carsWithImages
//              });
        
//     }catch(error){
//         console.log(`${error} : Error occured while loading images`);
//     }  
// }

// module.exports = handleHomePage;