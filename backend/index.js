// The reason we require instead of import is so that it won't load if it can't import it

const express = require("express");
const app = express();              
    // lets us define ROUTES/APIs (like app.get('/articles', (req, res) => res.send())

const pool = require("./database") 
    // imports the database.js file to establish a connection with the TPADatabase

const port = 5000;    // just wanna be techie, unneeded really
app.listen(port, () => { // starts the server, confirm with console.log
    console.log("Server initiated, listen on port:", port);
}); 

const cors = require("cors"); 
    // connects the frontend port (5173 or something) and server port (5000?)
app.use(cors()); 
    // readies CORS so that the frontend can communicate with the backend
app.use(express.json()); 
    // enables server to understand JSON data from requests


// =========== ROUTES, REST API (For CRUD using HTTP) for Article Operations ==========

const slugify = str => 
    str.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-") 
// make the last part of the headline a url for better SEO

// Create an article (C)
app.post("/article", async(req, res) => {
    const client = await pool.connect();  // connect to the database
    
    try {
        // declare values to be used as parameter
        const { article_headline, 
            article_body, 
            article_authors = [],
            media_providers = [],
            media_url = []
        } = req.body;

        if(!article_headline || !article_body) {
            return res.status(400).json({error: "article headline and body is not found."})
        }

        const slug_headline = slugify(article_headline)

        await client.query("BEGIN"); // starts the transaction (multiple queries)

        // ============== //
        // CREATE ARTICLE //
        // ============== //

        const createArticle = await client.query(
            `INSERT INTO article 
            (article_headline, article_body, article_type, slug_headline)
            VALUES ($1, $2, $3, $4) RETURNING *`, 
            [article_headline, article_body, article_type, slug_headline]
        );

        const article = createArticle.rows[0]
        //after creation, take article's id

        const articleID = article.article_id

        // =================== //
        // LINK AUTHOR_ARTICLE //
        // =================== //

        for(const staffID of staff_article){
            await client.query(
                `INSERT INTO staff_article 
                (article_id, staff_id, contribution_As)
                VALUES ($1, $2, $3)`, [articleID, staffID, "writer"]
            )
        }

        // =================== //
        // LINK MEDIA Provider_ARTICLE //
        // =================== //

        for(const staffID of article_media){
            await client.query(
                `INSERT INTO article_media 
                (article_id, staff_id, contribution_As)
                VALUES ($1, $2, $3)`, [articleID, staffID, "Writer"]
            )
        }

        res
            .status(201)
            .location(`/article/${article.article_id}/${article.slug_headline}`)
            .json(article);

    } catch (error) {
        console.error("Error creating article: ", error.message);
    } finally {
        client.release() // releases this particular pool query (total: 10)
    }
})

// get all ACTIVE STAFF

app.get("/active-staff", async(req, res) => {
    try {
        const allActiveStaff = await pool.query
            ("SELECT * FROM staff WHERE staff_isactive = true ORDER BY staff_last_name")
        res.json(allActiveStaff.rows)
        
    } catch (error) {
        console.error("Error fetching all active staff:", error.message)
        res.json(500).json({error})
    }
})