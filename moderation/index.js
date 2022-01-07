const express = require("express");
const bodyParser =  require("body-parser");
const axios = require("axios");
var config = require("../config.json");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {

    const { type, data } = req.body;

    if (type === "CommentCreated")
    {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        // emit to event bus
        await axios.post(`http://${config.host_ip}:7000/events`, {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }

    res.send({});

});

app.listen(4003, () => {
    console.log("Moderation Service listening at port 4003...");
});