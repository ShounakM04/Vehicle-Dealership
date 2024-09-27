const db = require("../models/database");

async function handleGetQuery(req, res) {
    try {
        const enquiry = await db.query(`SELECT * FROM customerQuery`);
        const custEnquiry = enquiry.rows; 
        res.json(custEnquiry); 
    } catch (error) {
        console.log(`Error occurred while fetching customer queries: ${error}`);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

async function handleNewCustomerQuery(req, res) {
    try {
        const { custName, custContact, custQuery } = req.body;
        console.log(custName, custContact, custQuery);
        const query = `INSERT INTO customerQuery (custName, custContact, custQuery) VALUES ($1, $2, $3)`;
        const values = [custName, custContact, custQuery];

        await db.query(query, values); 
        res.status(201).send("Customer query added"); 

    } catch (error) {
        console.log(`Error occurred while adding customer query: ${error}`);
        
        if (error.code === '23505') { 
            res.status(400).json({ message: 'Duplicate entry. Customer query already exists.' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }
}

async function handleDeleteCustomerQuery(req, res) {
    const { custcontact } = req.params; 

    try {
        const result = await db.query(`DELETE FROM customerQuery WHERE custcontact = $1`, [custcontact]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Customer query not found' }); 
        }

        res.status(200).json({ message: 'Customer query deleted successfully' }); 
    } catch (error) {
        console.log(`Error occurred while deleting customer query: ${error}`);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

module.exports = {
    handleGetQuery,
    handleNewCustomerQuery,
    handleDeleteCustomerQuery 
};