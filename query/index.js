const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios');

// env variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

// model data
const posts = {};

const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;
        console.log(`id=${id}, content=${content}, postId=${postId}`);

        //find the post to update
        const post = posts[postId];
        //console.log(JSON.stringify(post));
        post.comments.push({ id, content, status });
    }

    if (type === "CommentUpdated") {
        const { id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
} 

app.get('/posts', (req, res) => {
    console.log('Getting posts from query service...');
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log("Query service running at port 4002...");

    console.log('Query Service - Getting all events from service buss data store...');
    // get all the events from the service bus data store
    const res = await axios.get(`http://blog-eventbus-clusterip-service:7000/events`);
    for (let event of res.data) {
        console.log('Processing event:', event.type);
        handleEvent(event.type, event.data);
    }
});