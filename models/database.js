const mysql = require('mysql2');

require('dotenv').config();

const pool = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    port     : process.env.DB_PORT,
    password : process.env.DB_PASS,
    database : 'tingbooster',
    connectionLimit: 10
});

const promisePool = pool.promise()

module.exports = promisePool;