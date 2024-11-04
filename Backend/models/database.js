require("dotenv").config();
const pg = require("pg");

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
db.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

module.exports = db;
