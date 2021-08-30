import express from "express";
import { randomBytes } from "crypto";

const app = express();

app.use(express.json());

const commentsByPostId= {};
app.get("/posts/:id/comments", (req,res) => {
  console.log(req.params.id);
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req,res) => {

  const id = randomBytes(4).toString("hex");
  const {content} = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({id, content});
  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);


});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});