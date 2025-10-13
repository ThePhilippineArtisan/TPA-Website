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







// ROUTES, REST API (For CRUD using HTTP) //

// Create an article (C)

app.post("/articles", async(req, res) => {
    try {
        console.log(req.body);
    } catch (error) {
        console.error(error.message);
    }
})

// Get latest articles (R)

app.get

// Get an article (R)

// Update/Edit an article (U)

// Delete an article (D)