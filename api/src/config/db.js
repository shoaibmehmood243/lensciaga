const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.getConnection((err, conn) => {
  console.log('Connecting to database....');
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  if(conn){
    console.log("Database Connection established! ")
    conn.release();
  }  
});

module.exports = pool.promise();
