const db = require("../models/database");

async function handleGetQuery(req,res){
    try{
        const enquiry = await db.query(`SELECT * FROM customerQuery`);
        const custEnquiry = enquiry.rows[0];
         res.json({custEnquiry  });}
    catch(error){
        console.log(`Error occured while fetch customer queries : ${error}`)
    }
}

async function handleNewCustomerQuery(req,res) {
    try{
        const {custName,custContact,custQuery} = req.body;
        console.log(custName,custContact,custQuery)
        const query = `INSERT INTO customerQuery  (custName,custContact,custQuery) VALUES ($1,$2,$3)`;
        const values = [custName,custContact,custQuery];

        db.query(query,values);
        res.send("Customer query added")

    }catch(error){
        console.log(`Error occured while adding cusomter query : ${error}`);
    }
}

module.exports = {
    handleGetQuery,handleNewCustomerQuery
}