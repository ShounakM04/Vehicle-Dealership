// require("dotenv").config();
// const pg = require("pg");

// const { Pool } = pg;

// const db = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// });
// db.connect()
//     .then(() => console.log('Database connected successfully'))
//     .catch(err => console.error('Database connection error:', err));

// module.exports = db;

const pg = require("pg")
require('dotenv').config();

//console.log(typeof process.env.DATABASE_PASSWORD, process.env.DATABASE_PASSWORD);

const db =  new pg.Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database:process.env.DATABASE_NAME,
    password:process.env.DATABASE_PASSWORD,
    port:process.env.DATABASE_PORT,
   
});

db.connect();
module.exports = db;