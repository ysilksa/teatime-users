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
        res.status(500).json({ error: "Failed to fetch users."});
    }
});


// delete request: delete a user by id
app.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // sql query
        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *;", 
            [id] 
        );

        // check if result exists
        if (result.rowCount = 0) {
            return res.status(400).json({ error: "This user doesn't exist."});
        }

        // return success message with deleted user's info 
        res.json({ message: "User deleted successfully.", user : result.rows[0]});

    } catch (err) {
        console.error("Query error: ", err);
        res.status(500).json({ error: "Failed to delete user."});
    }
});

// patch request: update a user's info (partially)
app.patch("/api/users/:id", async (req, res) => {
    try {
        // grab user's id from req
        const { id } = req.params; 

        // extract the fields to update from the req's body
        const { first_name, last_name, email, profile_picture } = req.body; 

        // build the query based on what is provided 
        const updates = [];
        const values = [];
        let query = "UPDATE users SET";

        // update updates and values 
        if (first_name) {
            updates.push("first_name = $1");
            values.push(first_name);
        }

        if (last_name) {
            updates.push("last_name = $" + (updates.length + 1));
            values.push(last_name);
        }

        if (email) {
            updates.push("email = $" + (updates.length + 1));
            values.push(email);
        }

        if (profile_picture) {
            updates.push("profile_picture = $" + (updates.length + 1));
            values.push(profile_picture);
        }

        // check if anything is actually being changed 
        if (updates.length === 0) {
            res.status(400).json({ error: "There is nothing to update."});
        }    

        // update the query with the new values 
        query += " " + updates.join(", ") + " WHERE id = $" + (updates.length + 1) + " RETURNING *";
        values.push(id);

        // execute the query 
        const result = await pool.query(query, values);

        // check if query was executed successfully
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User does not exist."});
        }

        // respond with updated user
        res.json(result.rows[0]);

    } catch (err) {
        console.error("Query error: ", err);
        res.status(500).json({ error: "Failed to update user's info."});
    }
});

// to start the app, refer to part 3 of workshop 7
// PORT is where the app lives in 
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => { // app listens on this port
    console.log(`Server running on post ${PORT}`);
});

module.exports = app; 