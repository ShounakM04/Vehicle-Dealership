import express from "express";
import { handleGetQuery, handleNewCustomerQuery, handleDeleteCustomerQuery } from "../controllers/customerQuery.controller.js";


const customerReviewRouter = express.Router();

customerReviewRouter.get("/",handleGetQuery);

customerReviewRouter.post("/", handleNewCustomerQuery);

customerReviewRouter.delete("/", handleDeleteCustomerQuery  );


// module.exports = customerReviewRouter;
export default customerReviewRouter
