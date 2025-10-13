const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "superuser",
    host: "localhost",
    port: 5432,
    database: "TPADatabase"
});

module.exports = pool;