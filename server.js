
console.log("Starting backend...");

import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "internship_management",
  port: Number(process.env.DB_PORT || 3306)
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("Connected to MySQL database!");
});

app.get("/", (req, res) => {
  res.send("Internship Management Backend is working!");
});

app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get("/api/internships", (req, res) => {
  db.query("SELECT * FROM internships", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});

