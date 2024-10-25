const db = require("../models/database")

// async function handleSellCar(req, res) {
//     try {

//         // const { sellingPrice, ownerName, contactNo, downPayment, totalInstallments, installmentAmount, commission, carID } = req.body;

//         const carID  = req.body.formData.carID;
//         console.log("carID : "+carID);
//         // console.log(req.body)    
//         const updateQuery = `UPDATE cardetails SET status = true WHERE registernumber = $1`;
//         await db.query(updateQuery, [carID]);
//         res.status(200).json({ message: 'Car sold successfully!' });
//     } catch (error) {
//         return res.status(300).json({ message: "Error occurred while selling the car", error });

//     }
// }

async function handleSellCar(req, res) {
    const carID  = req.body.formData.carID;  // Access carID directly from req.body
    const {
        sellingPrice,
        ownerName,
        contactNo,
        downPayment,
        totalInstallments,
        installmentAmount,
        commission
    } = req.body.formData;  // Destructure the fields directly from req.body

    try {
        const updateQuery = `UPDATE cardetails SET status = true WHERE registernumber = $1`; // Update based on registernumber (carID)
        await db.query(updateQuery, [carID]);
        const result = await db.query(
            `INSERT INTO soldcardetails (
                registernumber, selling_price, owner_name, contact_no, 
                down_payment, total_installments, installment_amount, commission
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [
                carID,
                sellingPrice,
                ownerName,
                contactNo,
                downPayment,
                totalInstallments,
                installmentAmount,
                commission
            ]
        );
        // const updateQuery = `UPDATE cardetails SET status = true WHERE registernumber = $1`; // Update based on registernumber (carID)
        // await db.query(updateQuery, [carID]);
        res.status(200).json({ message: 'Car sold successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = handleSellCar;