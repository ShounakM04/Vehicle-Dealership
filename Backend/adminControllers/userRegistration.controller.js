import db from "../models/database.js";
import { generateAdminToken, generateDriverToken, generateEmployeeToken } from "../middlewares/auth-jwt.js";

async function handleUserRegistration(req, res) {
    const { userID, userName, userPassword, userDesignation } = req.body;
    const { isAdmin, isEmployee, isDriver } = req.query;
    try {
        // Remove hashing of password
        const query = `INSERT INTO users (userID, userName, userPassword, userDesignation) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [userID, userName, userPassword, userDesignation];
        const user = await db.query(query, values);
        
        if (isAdmin) {
            return res.json(generateAdminToken(user.rows[0]));
        }
        if (isDriver) {
            return res.json(generateDriverToken(user.rows[0]));
        }
        if (isEmployee) {
            return res.json(generateEmployeeToken(user.rows[0]));  
        }
    } catch (error) {
        console.log(`Error Occurred: ${error}`);
        return res.status(401).send("Unexpected Error Occurred");
    }
}

async function handleUserLogin(req, res) {
    const { userID, userPass } = req.body;
    try {
        if (!(userID && userPass)) {
            return res.status(400).send("Enter the details");
        }
        const query = `SELECT * FROM users WHERE userID = $1`;
        const values = [userID];
        
        const user = await db.query(query, values);
        const userDetails = user.rows[0];

        if (!userDetails) {
            return res.status(400).send("User does not exist");
        }

        // Directly check user password without hashing
        if (userPass !== userDetails.userPassword) {
            return res.status(401).send("Access Denied");
        }

        let token;
        if (userDetails.userDesignation === 'Admin') {
            token = generateAdminToken(userDetails);
        }
        if (userDetails.userDesignation === 'Employee') {
            token = generateEmployeeToken(userDetails);
        }
        if (userDetails.userDesignation === 'Driver') {
            token = generateDriverToken(userDetails);
        }

        console.log(token);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.json(token);
    } catch (error) {
        console.log(`Error occurred: ${error}`);
        res.status(400).send("There has been an error in the login process");
    }
}

export {
    handleUserLogin,
    handleUserRegistration
}
