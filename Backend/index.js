const express = require("express");
const logResReq = require("./log.js"); // Import without destructuring
const cors = require("cors");
const rateLimit = require('express-rate-limit');

const PORT = 8000

  const app = express();

  //routers
  const HomeRoute = require("./routes/home.route.js");
  const Imageroute = require("./routes/image.route.js");
  const DetailsRoute = require("./routes/carDetails.route.js");
  const SpecificPageRoute = require("./routes/specificCar.route.js");
  const DeleteRecordRoute = require("./routes/deleteRecord.route.js")
  const customerQueryRoute = require("./routes/customerQuery.route.js")
  const LoginRoute = require("./adminRoutes/userLogin.route.js")
  const RegistrationRoute = require("./adminRoutes/userRegistration.route.js")
  const DashboardRoute = require("./adminRoutes/dashboard.route.js")
  const InsuranceRoute = require("./adminRoutes/insurance.route.js")
  const MaintainanceRoute = require("./adminRoutes/maintainance.route.js")
  const InstallmentRoute = require("./adminRoutes/installments.route.js")
  const ProfitRoute = require("./adminRoutes/profit.route.js")
  const carDetailsEdit = require("./routes/carDetailsEdit.route.js")
  // const LogRoute = require('./adminRoutes/logs.route.js');
  const miscellaneousCostRoute = require('./adminRoutes/miscellaneousCosts.route.js')
  const LogDownloadRoute = require('./adminRoutes/logDownload.route.js')
  const handleAddDescriptionRoute =  require("./routes/addImageDescription.route.js") 
  const handleAddAccountDetailsRoute =  require("./adminRoutes/accountDetails.route.js") 
  const unauthorizedSpecificCar = require("./routes/unauthorizedSpecificCar.route.js")
  const { authenticateToken, authorizeEmployeeOrAdmin ,authorizeDriverOrEmployeeOrAdmin, authorizeAdmin} = require("./controllers/userRole-auth.js");
  const BillGenerate = require('./adminRoutes/billgenerate.route.js')
  const ValidateTokenRoute = require("./routes/ValidateToken.route.js");
  const ActiveAccountRoute = require("./adminRoutes/activeAccounts.routes.js")
  const editMiscellaneousRoute = require("./adminRoutes/editMiscellaneous.route.js")
  // const corsOptions = {
  //     origin: '*', // Allow all origins
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  //     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  // };

  // const port = process.env.PORT || 3001;

  // Explicitly handle OPTIONS requests
  app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200); // Important: Ensure this is 200 OK
  });

  // CORS middleware
  app.use(cors({
    origin: '*', // No trailing slash
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  

  // Rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes window
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again after 10 minutes.",
//   keyGenerator: (req) => req.ip, // Limit by IP address
//   statusCode: 429, // HTTP status code for rate limiting
//   handler: (req, res, next, options) => {
//     // Custom handler in case of rate limit exceeded
//     res.status(options.statusCode).json({
//       message: options.message,
//     });
//   },
// });

// // Apply the rate limiter to all routes
// app.use(limiter);


// Use your custom logging middleware
// app.use(logResReq("logs.txt"));
app.use("/", HomeRoute);
app.use("/login", LoginRoute);
app.use('/validate-token',ValidateTokenRoute)
app.use("/landingcar",unauthorizedSpecificCar )
app.use(authenticateToken);
// app.use(logResReq());
// Using Routes
app.use("/upload",  authenticateToken, authorizeDriverOrEmployeeOrAdmin, Imageroute);
app.use("/details",authenticateToken, authorizeEmployeeOrAdmin, DetailsRoute);
app.use("/car", SpecificPageRoute);
app.use("/delete", authorizeDriverOrEmployeeOrAdmin, DeleteRecordRoute);
app.use("/customer", customerQueryRoute);
app.use("/register", authenticateToken, authorizeEmployeeOrAdmin, RegistrationRoute);
app.use("/dashboard", DashboardRoute)
// app.use("/insurance",InsuranceRoute);
app.use("/maintainance", MaintainanceRoute);
app.use("/delete-image", Imageroute)
app.use("/profits", ProfitRoute)
app.use("/edit-fields", carDetailsEdit)
app.use("/logs", authorizeAdmin, LogDownloadRoute)
app.use("/miscellaneous-costs",authenticateToken, authorizeEmployeeOrAdmin,miscellaneousCostRoute);
app.use("/installments", InstallmentRoute);
app.use("/activeAccounts", ActiveAccountRoute);
app.use("/Description",handleAddDescriptionRoute);
app.use("/accountDetails",handleAddAccountDetailsRoute);
app.use("/bill", BillGenerate)
app.use("/editMiscellaneous", editMiscellaneousRoute)

// Correct `app.listen` without req and res parameters
app.listen(PORT, () => {
    console.log(`Server connected to port ${PORT}`);
});

// module.exports = app;
