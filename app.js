const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { getQuestions } = require("./services/questions.js");
let highScore = 0;
let questions = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
  console.log("app listening at port 8080");
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/select", (req, res) => {
  res.render("select.ejs");
});

app.post("/select", async (req, res) => {
  let { amount, category, difficulty } = req.body;
  questions = await getQuestions(amount, category, difficulty);
  res.redirect("/main");
});

app.get("/api/questions", (req, res) => {
  res.json(questions);
});

app.get("/api/highScore", (req, res) => {
  res.json({ highScore });
});

app.get("/main", (req, res) => {
  res.render("main");
});

app.post("/api/highScore", (req, res) => {
  const { newhighScore } = req.body;
  if (newhighScore > highScore) {
    highScore = newhighScore;
    console.log("High score updated successfully.");
  } else {
    console.log("Invalid high score");
  }
});
