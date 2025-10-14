// The reason we require instead of import is so that it won't load if it can't import it

const express = require("express");
    // imports express framework

const app = express();
    // lets us define ROUTES/APIs (like app.get('/articles', (req, res) => res.send())

const cors = require("cors");
    // connects the frontend port (5173 or something) and server port (5000?)

const pool = require("./database")
    // imports the database.js file to establish a connection with the TPADatabase
    // also lets the ROUTES/API to communicate with the database efficiently

const port = 5000;
    // just wanna be techie, unneeded really

app.listen(port, () => {
    console.log("Server initiated, listen on port:", port);
    // starts the server, confirm with console.log
}); 

app.use(cors());
    // readies CORS so that the frontend can communicate with the backend

app.use(express.json()); 
    // enables server to understand JSON data from requests







// ROUTES, REST API (For CRUD using HTTP) for Article Operations//

// Create an article (C)

const slugify = str => str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "_")

app.post("/article", async(req, res) => {
    try {
        const {
            article_headline,
            article_body,
            article_type,
            publised_At,
            is_Published
        } = req.body;


    } catch (error) {
        console.error(error.message);
    }
})

// Get latest articles (R)

app.get("/article", async(req, res) => {
    try { //find a way to only get at most 10 headlines, text, author, first/one image, and graphics responsible 
        const allArticles = await pool.query("SELECT * FROM article")
        res.json(allArticles.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// Get an article (R)

app.get("/article/:id", async (req, res) => {
    try {
        console.log(req.params);
        const { article_id } = req.params;
        const article = await pool.query("SELECT * FROM staff WHERE article = $1", [article_id]) 
    } catch (error) {
        console.error(error.message)
    }
})

// Update/Edit an article (U)

// Delete an article (D)







// ROUTES, REST API (For CRUD using HTTP) for STAFFER Operations//

// Create staff (C)

app.post("/staff", async(req, res) => {
    try {
        console.log(req.body);
    } catch (error) {
        console.error(error.message);
    }
})

// Get active staff (R)

app.get("/staff", async(req, res) => {
    try { //find a way to only get at first only the active ones
        const allStaff = await pool.query("SELECT * FROM staff")
        res.json(allStaff.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// Get a staff (R)

app.get("/staff/:id", async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const staff = await pool.query("SELECT * FROM staff WHERE staff_id = $1", [id]) 
        res.json(staff.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// Update/Edit a staff (U)

// Delete a staff (D)

app.delete("/staff/:id", async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const deleteStaff = await pool.query("DELETE FROM staff WHERE staff_id = $1", [id]) 
        res.json(staff.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})