// lib/db.js
import mysql from "mysql2/promise";

let pool;

export async function getConnection() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,      // MySQL host (e.g. localhost)
        user: process.env.DB_USER,      // MySQL username
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: parseInt(process.env.DB_PORT || "3306"), // default MySQL port
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log("Connected to MySQL");
    } catch (err) {
      console.error("DB connection failed:", err.message);
      throw err;
    }
  }
  return pool;
}
