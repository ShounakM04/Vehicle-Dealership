const express = require("express");
const logResReq = require("./log"); // Import without destructuring
const port = 8000;
const app = express();
const path = require("path")




//routers
const ImageRouter = require("./routes/image");
const DetailsRouter  = require("./routes/details")

app.set("view engine","ejs");
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.set('views',path.resolve("./views"));

app.get("/",(req,res)=>{
    res.send("hello from server");
})



// Use your custom logging middleware
app.use(logResReq("logs.txt"));

// Using Routes
app.use("/upload",ImageRouter);
app.use("/details",DetailsRouter);


// Correct `app.listen` without req and res parameters
app.listen(port, () => {
    console.log(`Server connected to port ${port}`);
});
