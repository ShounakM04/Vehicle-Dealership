const pg = require("pg")

const db =  new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database:'cardealership',
    password:'424354',
    port:5432,
});

db.connect();
module.exports = db;