const {createPool} = require("mysql2")

const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.USER_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    connectionLimit: 10,
  });

  //test the connection 

  pool.getConnection((err,connection)=>{
    if(err){
        console.log("Database connection failed", err.stack);
    }
    else{
        console.log("Connection to database is successful")
        connection.release();
    }
  })

  module.exports = pool ;
