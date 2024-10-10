const express = require("express")
const {handleGetQuery,handleNewCustomerQuery} = require("../controllers/customerQuery.controller")


const customerReviewRouter = express.Router();

customerReviewRouter.get("/",handleGetQuery);

customerReviewRouter.post("/", handleNewCustomerQuery);

module.exports = customerReviewRouter;