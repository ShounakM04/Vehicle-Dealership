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
    const {userID,userPass} = req.body;
    try{
        if(!(userID,userPass)) {
            return res.status(400).send("Enter the details");
        }
        const query = `SELECT * FROM users where userid = $1`
        const values = [userID];

         
        const user = await db.query(query,values);
        const userDetails = user.rows[0];

        if(!userDetails){
            return res.status(400).send("User does not exists");
        }

        //console.log(userDetails );
        const result = await bcrypt.compare(userPass,userDetails.userpassword);
        
        if(!result) {
            return res.status(401).send("Access Denied");
        }


        let token;
        if(result && userDetails.userdesignation === 'admin'){
            token = generateAdminToken(user);
        }
        if(result && userDetails.userdesignation === 'Employee'){
            token = generateEmployeeToken(user);
        }
        if(result && userDetails.userdesignation === 'driver'){
            token = generateDriverToken(user);
        }
        console.log(token)
        res.setHeader('Authorization' , `Bearer : ${token}`);
        return res.send(token)
        // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    }catch(error){
        console.log(`Error occured is : ${error}`);
        res.status(400).send("There has been an error in the login process")
    }

}

module.exports = {
    handleUserLogin,
    handleUserRegistration
}