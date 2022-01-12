const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require('cors');
const axios = require("axios");

// env variables

const app = express();
app.use(bodyParser.json());
//cors
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {

    //random id
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;

    // if null or nothing found then return empty array
    const comments = commentsByPostId[postId] || [];
    
    comments.push({id: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    // emit event
    axios.post(`http://blog-eventbus-clusterip-service/events`, {
        type: "CommentCreated",
        data: {
           id: commentId, 
           content,
           postId,
           status: 'pending'
        } 
    });

    res.status(201).send(comments);
});

app.post(`/events`, (req, res) => {
    console.log(`Event Received - ${req.body.type}`);
    
    const { type, data } = req.body;
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        })

        comment.status = status;

        // emit event to other services
        axios.post(`http://blog-eventbus-clusterip-service/events`, {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }

    res.send({});
});

app.listen(5000, () => {
    console.log("Comment service listening at port 5000..");
});