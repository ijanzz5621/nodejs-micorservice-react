const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
var config = require("../config.json");

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
    axios.post(`http://${config.host_ip}:4000/events`, event); // post service
    axios.post(`http://${config.host_ip}:5000/events`, event); // comment service
    axios.post(`http://${config.host_ip}:4002/events`, event)
        .catch((err) => {
            console.log("Error connection to query service...");
        }); // query service
    axios.post(`http://${config.host_ip}:4003/events`, event); // moderation service

    res.send({status: "OK"});
});

app.get("/events", (req, res) => {
    res.send(events);
})

// listen
app.listen(7000, () => {

    console.log("Event Bus service listening at port 7000...");

}); 