const { Pool } = require("pg");
require("dotenv").config();

// sanity check, check if we even have a database url in the env file
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// this pool object passes in connection string 
// should be the database url
// use env variables to keep your database SECURE. 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});