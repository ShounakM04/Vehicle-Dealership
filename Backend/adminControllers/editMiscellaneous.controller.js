const db = require("../models/database");

async function editMiscellaneousFields(req, res) {
    try {
        const { tablename, fieldToEdit, newValue, whereField, whereValue } = req.body;
        //console.log(tablename, fieldToEdit, newValue, whereField, whereValue);

        // Ensure dynamic table and column names are properly sanitized
        const query1 = `UPDATE ${tablename} SET ${fieldToEdit} = $1 WHERE ${whereField} = $2`;
        const values = [newValue, whereValue];

        await db.query(query1, values);

        res.status(200).send("Field Edited Successfully");
    } catch (error) {
        console.log(`${error} : Error occurred while editing fields`);
        res.status(500).send("An error occurred while editing fields");
    }
}

module.exports = {
    editMiscellaneousFields
};
