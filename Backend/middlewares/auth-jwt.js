import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();




const generateAdminToken = ({userID, password}) =>{
    return jwt.sign({userID,password, isAdmin :true},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
}

const generateEmployeeToken = ({userID, password}) =>{
    const token =  jwt.sign({userID,password, isEmployee :true},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
    console.log("token");
    return token;
}

const generateDriverToken = ({userID, password}) =>{
    return jwt.sign({userID,password, isDriver :true},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
}

export {
    generateAdminToken,
    generateEmployeeToken,
    generateDriverToken
}