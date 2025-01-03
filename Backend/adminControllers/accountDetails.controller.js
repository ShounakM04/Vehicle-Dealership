const db = require("../models/database");

async function addInvestment(req, res) {
    const {  description,amount,date} = req.body;

    // Validate input
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Invalid investment amount" });
    }

    try {
        // Update the `amount` column in the `Investment` table
        await db.query(
            `INSERT INTO Investment(amount,description,date) values($1,$2,$3)`,
            [Number(amount),description,date]
        );

        // Respond with success
        res.status(200).json({ message: "Investment added successfully" });
    } catch (error) {
        // Log and handle errors
        console.error("Error adding investment:", error);
        res.status(500).json({ message: "Failed to add investment", error: error.message });
    }
}

const getTotalAccountDetails = async (req, res) => {
    //AccountDetails
    try {
        const totalBuyResponse = await db.query("SELECT SUM(vehiclebuyprice) AS total FROM cardetails");
        const totalMaintainanceResponse = await db.query("SELECT SUM(maintainancecost) AS total FROM maintainancedetails");
        const totalMiscellaneousResponse = await db.query("SELECT SUM(cost) AS total FROM miscellaneous_costs");
        const totalInstallmentsResponse = await db.query("SELECT SUM(amount) AS total FROM installments");
        const totalSellingsResponse = await db.query("SELECT SUM(selling_price) AS total FROM soldcardetails");
        const totalDownPaymentsResponse = await db.query("SELECT SUM(down_payment) AS total FROM soldcardetails");
        const totalCommisionResponse = await db.query("SELECT SUM(commission) AS total FROM soldcardetails");
        const totalInvestmentResponse = await db.query("SELECT SUM(amount) AS total FROM Investment");

        // Extracting values from query responses
        const totalBuy = Number(totalBuyResponse.rows[0].total) || 0;
        const totalMaintainance = Number(totalMaintainanceResponse.rows[0].total) || 0;
        const totalMiscellaneous =Number( totalMiscellaneousResponse.rows[0].total )|| 0;
        const totalInstallments = Number(totalInstallmentsResponse.rows[0].total) || 0;
        const totalSellings = Number(totalSellingsResponse.rows[0].total) || 0;
        const totalDownPayments = Number(totalDownPaymentsResponse.rows[0].total) || 0;
        const totalCommision =Number( totalCommisionResponse.rows[0].total )|| 0;
        const totalInvestment = Number(totalInvestmentResponse.rows[0].total) || 0;

        // Calculating remaining balance
        const Remaining_Balance = ( totalInvestment + totalInstallments + totalDownPayments + totalCommision ) - (totalBuy + totalMaintainance + totalMiscellaneous);

        // Creating the AccountDetails object
        const AccountDetails = {
            totalBuy,
            totalMaintainance,
            totalMiscellaneous,
            totalInstallments,
            totalSellings,
            totalDownPayments,
            totalCommision,
            totalInvestment,
            Remaining_Balance
        };
        // console.log("/////////////////////////"+Remaining_Balance);

        // Returning the AccountDetails object
        res.status(200).json(AccountDetails);
    } catch (error) {
        console.error("Error fetching account details:", error);
        res.status(500).json({ error: "Failed to fetch account details" });
    }

};

// Filter costs by specific month and year
const filterByMonthAndYear = async (req, res) => {
    const { month, year } = req.query;
  
    try {
        // Fetch costs for the filtered month and year
        const result = await db.query(
            `SELECT * FROM investment WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2`,
            [month, year]
        );
  
        // Log the result to ensure costs are fetched correctly
        // console.log("Fetched Costs:", result.rows);
  
        // Fetch the total cost for the filtered month and year
        const totalCostResult = await db.query(
            `SELECT SUM(amount::DECIMAL) AS totalCost FROM investment WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2`,
            [month, year]
        );

        // Log the raw result of the total cost query
        // console.log("Total Cost Query Result:", totalCostResult);

        // Convert total cost to a number (parse the string as a float)
        const totalCost = parseFloat(totalCostResult.rows[0]?.totalcost) || 0;

        // Log the final total cost
        // console.log("Final Total Cost:", totalCost);

        res.json({
            costs: result.rows || [], // Ensure costs is always an array
            totalCost: totalCost, // Ensure total cost is a number
        });
    } catch (error) {
        console.error("Error filtering costs:", error);
        res.status(500).json({ error: "An error occurred while filtering costs" });
    }
};

async function getmonthlyLogs(params) {
    const {} = req.body;
    try {
        
    } catch (error) {
        console.log(`Error occured while generating monthly sales : ${error}`);
        res.status(500).json({ error: "An error occurred while generating monthly sales" });
    }
}

// Export the controllers
module.exports = {
    addInvestment,
    getTotalAccountDetails,filterByMonthAndYear
};