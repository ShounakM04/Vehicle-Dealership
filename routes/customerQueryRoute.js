const express = require("express")
const {handleGetQuery,handleNewCustomerQuery} = require("../controllers/customerQueryController")


const customerReviewRouter = express.Router();

customerReviewRouter.get("/",handleGetQuery);

customerReviewRouter.post("/", handleNewCustomerQuery);

module.exports = customerReviewRouter;