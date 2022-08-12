const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const goalsRoutes = require("./routes/goals");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://piolagunajfu:"+process.env.MONGO_ATLAS_PW+"@cluster0.hakle.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(()=>{
  console.log("Connected to the database");
}).catch(()=>{
  console.log("Connection failed");
});

app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
  next();
});

app.use("/api/goals",goalsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
