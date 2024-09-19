const express = require("express");
const logResReq = require("./log"); // Import without destructuring
const fs = require("fs")
const port = 8000;
const app = express();
app.use(express.urlencoded({ extended: false }));
const upload = require("./middlewares/multer.middleware");
const handleImageUpload = require("./controllers/image");
const handleCarDetails = require("./controllers/cardetails");

app.set("view engine","ejs");

app.use(express.json()); 

// Use your custom logging middleware
app.use(logResReq("logs.txt"));

// Define a simple GET route
app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/", (req, res) => {   
    res.send("Post request received");
});

app.get("/upload",(req,res) => {
    res.render("upload");
})

app.post("/upload", upload.array("images[]",10), handleImageUpload);

app.get("/details",(req,res)=>{
    res.render("cardetails");
});

app.post("/details",handleCarDetails);
// Correct `app.listen` without req and res parameters
app.listen(port, () => {
    console.log(`Server connected to port ${port}`);
});
