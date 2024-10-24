const db = require("../models/database")

async function handleSellCar(req, res) {
    try {

        // const { sellingPrice, ownerName, contactNo, downPayment, totalInstallments, installmentAmount, commission, carID } = req.body;

        const  carID  = req.body.formData.carID;
        console.log("carID : "+carID);
        // console.log(req.body)    
        const updateQuery = `UPDATE cardetails SET status = true WHERE registernumber = $1`;
        await db.query(updateQuery, [carID]);
        res.status(200).json({ message: 'Car sold successfully!' });
    } catch (error) {
        return res.status(300).send("Error occured while selling the car")
    }
}

module.exports = handleSellCar;