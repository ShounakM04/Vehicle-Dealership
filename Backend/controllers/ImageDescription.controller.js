const db = require("../models/database")

async function handleDeleteImageDescription(req, res){
    try {
        const {uniqueID} = req.body;
        console.log(uniqueID)
        const query = `delete from imagedescription where uniqueid =($1)`;
        const values = [uniqueID];
        await db.query(query, values);

        return res.status(200).send("Record deleted successfully");
    }
    catch (error) {
        console.log(`Error occured while executig the queries : ${error}`);
        return res.status(400).send("Error in Record deletion");

    }

}

module.exports = {handleDeleteImageDescription};