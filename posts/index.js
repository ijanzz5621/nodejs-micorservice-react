const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require("axios");

// env variables
const HOST_IP = process.env.HOST_IP;

const app = express();
app.use(bodyParser.json());
//cors
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {

    //return res.json({message: "Get all list of posts."});
    res.send(posts);
});

app.post("/posts", async (req, res) => {

    // random id
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    
    posts[id] = {
        id, title
    };

    // submit event
    await axios.post(`http://${HOST_IP}:7000/events`, {
       type: "PostCreated",
       data: {
           id, 
           title
       } 
    });

    res.status(201).send(posts[id]);

});

app.post(`/events`, (req, res) => {
    //console.log(`Event received in post`, req.body);
    console.log(`Event Received - ${req.body.type}`);
    res.send({message: "event received from event-bus service!"});
});

app.listen(4000, () => {
    console.log(`Post service listening on port 4000...`);
});