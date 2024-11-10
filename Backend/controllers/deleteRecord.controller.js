const db = require("../models/database")

async function handleRecordDeletion(req, res) {
    const registernumber = req.body.deletedID;
    try {
        const query = `delete from cardetails where registernumber = ($1)`;
        const values = [registernumber];
        await db.query(query, values);

        return res.status(200).send("Car Records deleted successfully");
    }
    catch (error) {
        console.log(`The following error has occured : ${error}`);
        return;
    }

}

module.exports = handleRecordDeletion;