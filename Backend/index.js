import express from "express";
import logResReq from "./log.js"; // Import without destructuring
import cors from "cors";

// Routers
import HomeRoute from "./routes/home.route.js";
import Imageroute from "../Backend/routes/image.route.js";
import DetailsRoute from "./routes/carDetails.route.js";
import SpecificPageRoute from "./routes/specificCar.route.js";
import DeleteRecordRoute from "./routes/deleteRecord.route.js";
import customerQueryRoute from "./routes/customerQuery.route.js";
import LoginRoute from "./adminRoutes/userLogin.route.js";
import RegistrationRoute from "./adminRoutes/userRegistration.route.js";
import DashboardRoute from "./adminRoutes/dashboard.route.js";
import InsuranceRoute from "./adminRoutes/insurance.route.js";
import MaintainanceRoute from "./adminRoutes/maintainance.route.js";
import InstallmentRoute from "./adminRoutes/installments.route.js";
import ProfitRoute from "./adminRoutes/profit.route.js";

const app = express();

const corsOptions = {
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Use your custom logging middleware
// app.use(logResReq("logs.txt"));

// Using Routes
app.use("/", HomeRoute)
app.use("/upload", Imageroute);
app.use("/details", DetailsRoute);
app.use("/car", SpecificPageRoute);
app.use("/delete", DeleteRecordRoute);
app.use("/customer", customerQueryRoute);
app.use("/login", LoginRoute);
app.use("/register", RegistrationRoute);
app.use("/dashboard", DashboardRoute)
// app.use("/insurance",InsuranceRoute);
app.use("/maintainance",MaintainanceRoute);
app.use("/installments",InstallmentRoute);
app.use("/profits", ProfitRoute)

import serverless from 'serverless-http';

// module.exports.handler = serverless(app);
export const handler = serverless(app);