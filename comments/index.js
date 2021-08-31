import express from "express";
import cors from 'cors';
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId= {};
app.get("/posts/:id/comments", (req,res) => {
  console.log(req.params.id);
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req,res) => {

  const id = randomBytes(4).toString("hex");
  const {content} = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({id, content});
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated", 
    data: {
      id,
      content,
      postId: req.params.id
    }})
  .catch(err => console.log(err.message));

  res.status(201).send(comments);


});

app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);

  res.send({});
})

app.listen(4001, () => {
  console.log("Listening on port 4001");
});