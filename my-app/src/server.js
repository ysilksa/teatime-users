const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

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
// refer back to part 2 of workshop 7 for this 
app.get("/", (req, res) => {
    res.json({ message: "HELLO WORLD!" });
  });
  
// this is a good example of writing your requests
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users ORDER BY id ASC;" // our query
        ); 
        res.json(result.rows); // return json of results and the rows
    } catch (err) {
        console.error("Query error: ", err);
        res.status(500).json({ error: "Failed to fetch users "});
    }
});

// to start the app, refer to part 3 of workshop 7
// PORT is where the app lives in 
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => { // app listens on this port
    console.log(`Server running on post ${PORT}`);
});

module.exports = app; 