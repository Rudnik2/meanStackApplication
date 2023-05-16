const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let cors = require("cors");

const goalsRoutes = require("./routes/goals");
const tasksRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://piolagunajfu:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.hakle.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization,X-Auth-Token"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  next();
});

app.use("/api/goals", goalsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/user", userRoutes);

app.use(cors());

module.exports = app;
