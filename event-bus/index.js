const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

// env variables

// create the exrepss app
const app = express();

// event data
const events = [];

// middlewares
app.use(bodyParser.json());
app.use(cors());

app.post("/events", (req, res) => {

    const event = req.body;

    events.push(event);

    console.log("event received!!!" + event.data);

    // send out the event
    axios.post(`http://blog-posts-clusterip-service/events`, event); // post service
    axios.post(`http://blog-comments-clusterip-service/events`, event); // comment service
    axios.post(`http://blog-query-clusterip-service/events`, event)
        .catch((err) => {
            console.log("Error connection to query service...");
        }); // query service
    axios.post(`http://${HOST_IP}:4003/events`, event); // moderation service

    res.send({status: "OK"});
});

app.get("/events", (req, res) => {
    res.send(events);
})

// listen
app.listen(7000, () => {

    console.log("Event Bus service listening at port 7000...");

}); 