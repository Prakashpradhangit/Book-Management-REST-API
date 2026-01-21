import mysql from "mysql2"
import dotenv from "dotenv";
import creDeatils from "./details";
dotenv.config()


const db = mysql.createConnection({
  host: creDeatils.host,
  user: creDeatils.user,
  password: creDeatils.password,
  database: creDeatils.database

});


db.connect((err,) => {
  if (err) {
    console.error("❌ DB connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL");
});

const tableCreateQuery = `CREATE TABLE IF NOT EXISTS book_data (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  published_year INT NOT NULL,

  PRIMARY KEY (id),

  UNIQUE KEY unique_book (title, author, published_year)
);
`

db.query(tableCreateQuery, (err, result) => {
  if (err) {
    console.error("Error creating table:", err.message);
    return;
  }
  console.log("Table is ready");
});


const book = [];

export { db, book };




