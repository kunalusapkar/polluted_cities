const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

console.log("process.env.host------>", process.env.NAME);
exports.runQuery = function (query, values) {
  return new Promise(function (resolve, reject) {
    db.getConnection((error, connection) => {
      if (error) {
        console.log("Error -> ", error);
        reject(error);
      } else {
        // console.log("query-->" + query);
        console.log("Connection succesfull");
        connection.query(query, values, function (err, rows, fields) {
          connection.release();

          if (err) {
            console.log("rejecting ", query, values);
            // console.log(err)
            reject(err);
          } else {
            // console.log(rows);
            resolve(rows);
          }
        });
      }
    });
  });
};

exports.check = function (callback) {
  db.getConnection((err, connection) => {
    if (err) {
      console.log("Error -> ", err);
      if (err.code === "ER_ACCESS_DENIED_ERROR") {
        err = new Error(
          "Could not access the database. Check MySQL config and authentication credentials"
        );
      }
      if (
        err.code === "ECONNREFUSED" ||
        err.code === "PROTOCOL_SEQUENCE_TIMEOUT"
      ) {
        err = new Error(
          "Could not connect to the database. Check MySQL host and port configuration"
        );
      }
      callback(err);
    } else {
      connection.release();
      // callback();
      console.log("Database Connected");
    }
  });
};
