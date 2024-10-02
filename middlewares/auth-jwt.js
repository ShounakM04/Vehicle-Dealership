require("dotenv").config();
const jwt = require("jsonwebtoken")



const generateAdminToken = ({userID, password}) =>{
    return jwt.sign({userID,password, isAdmin :true},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
}

const generateEmployeeToken = ({userID, password}) =>{
    return jwt.sign({userID,password, isEmployee :true},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
}

const generateDriverToken = ({userID, password}) =>{
    return jwt.sign({userID,password, isDriver :true},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
}


module.exports = {
    generateAdminToken,
    generateEmployeeToken,
    generateDriverToken
}