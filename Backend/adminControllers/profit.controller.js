const db = require("../models/database");

async function calculateProfit(req, res){
    const { registernumber } = req.query;
    console.log(registernumber);
    
    try {
        const profitResponse = await db.query(
            `SELECT 
                sc.selling_price, 
                COALESCE(sc.commission, 0) AS commission, 
                COALESCE(SUM(md.maintainancecost), 0) AS total_maintainance_cost, 
                cd.vehiclebuyprice
            FROM soldcardetails sc
            LEFT JOIN maintainancedetails md ON md.registernumber = sc.registernumber
            JOIN cardetails cd ON cd.registernumber = sc.registernumber
            WHERE sc.registernumber = $1
            GROUP BY sc.selling_price, sc.commission, cd.vehiclebuyprice;`,
            [registernumber]
        );

        if (profitResponse.rows.length === 0) {
            return res.status(404).json({ message: "No data found for this car" });
        }

        const selling_price = parseFloat(profitResponse.rows[0].selling_price);
        const commission = parseFloat(profitResponse.rows[0].commission);
        const total_maintainance_cost = parseFloat(profitResponse.rows[0].total_maintainance_cost);
        const vehiclebuyprice = parseFloat(profitResponse.rows[0].vehiclebuyprice);

        const profit = selling_price - (total_maintainance_cost + vehiclebuyprice) + commission;

        return res.status(200).json({
            profit,
        });
    } catch (error) {
        console.error("Error calculating profit:", error);
        return res.status(500).json({ message: "Failed to calculate profit", error: error.message });
    }
};

module.exports = { calculateProfit };
