const express = require("express");
const logResReq = require("./log"); // Import without destructuring
const port = 8000;
const app = express();
const path = require("path");




//routers
const HomeRoute = require("./routes/homeRoute.js");
const Imageroute=require("./routes/imageRoute.js");     
const DetailsRoute  = require("./routes/cardetailsRoute.js");
const SpecificPageRoute = require("./routes/specifcCarRoute.js")
const DeleteRecordRoute = require("./routes/deleteRecordRoute.js")
const customerQueryRoute = require("./routes/customerQueryRoute.js")


app.set("view engine","ejs");
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.set('views',path.resolve("./views"));

// Use your custom logging middleware
app.use(logResReq("logs.txt"));

// Using Routes
app.use("/",HomeRoute)
app.use("/upload",Imageroute);
app.use("/details",DetailsRoute);
app.use("/car",SpecificPageRoute);
app.use("/delete",DeleteRecordRoute);
app.use("/customer",customerQueryRoute);

// Correct `app.listen` without req and res parameters
app.listen(port, () => {
    console.log(`Server connected to port ${port}`);
});
