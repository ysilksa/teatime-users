import express from "express";
import cors from "cors"; // acts as a middleman between front and back end, need it to allow someone outside to access the db
import { Pool, Query } from "pg";
import dotenv from "dotenv";


// typescript = javascript, but you add types to your code

// create an express app
const app = express();

// this app uses the cors middleware and json
// json = dictionary w/ keys and vals
app.use(cors());
app.use(express.json());

// create connection pool to our postgres db
const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// very simple endpoint to a server
// this route is called "get"
// protocol type get 
// when we load up the api, we get the message 
// YOU SHOULD DOWNLOAD POSTMAN, very easy way to test your api 
// refer back to video 2 for this 
app.get("/", (req, res) => {
    res.json({ message: "HELLO WORLD!" });
  });
  
// this is a good example of writing your requests
app.get("api/users", async (req, res) => {
    try {
        const result = await pool.query<User>(
            "SELECT * FROM users ORDER BY id ASC" // our query
        ); 
        res.json(result.rows); // return json of results and the rows
    } catch (err) {
        console.error("Query error: ", err);
        res.status(500).json({ error: "Failed to fetch users "});
    }
});
