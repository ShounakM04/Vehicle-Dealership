const bcrypt = require("bcrypt")
const db = require("../models/database");
const { generateAdminToken, generateDriverToken, generateEmployeeToken } = require("../middlewares/auth-jwt");
const saltRounds = 10;

async function handleUserRegistration(req,res) {
    const {userID,userName,userPassword,userDesignation} = req.body;
    const {isAdmin , isEmployee, isDriver} = req.query;
    try{
        const hashedPassword = await bcrypt.hash(userPassword,saltRounds);
        const query = `INSERT INTO users (userID, userName, userPassword, userDesignation) VALUES ($1,$2,$3,$4) RETURNING *`;
        const values = [userID,userName,hashedPassword,userDesignation]
        const user = await db.query(query,values);
        if(isAdmin){
            res.json(generateAdminToken(user.rows[0]));
        }
        if(isDriver){
            res.json(generateDriverToken(user.rows[0]));
        }
        if(isEmployee){
            res.json(generateEmployeeToken(user.rows[0]));  
        }
        
    }
    catch(error){
        console.log(`Error Occured is : ${error}`);
       return res.status(401).send("Unexpected Error Occured");
    }
}

async function handleUserLogin(req,res) {
    res.json("User Login");
}

module.exports = {
    handleUserLogin,
    handleUserRegistration
}