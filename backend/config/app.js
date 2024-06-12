const express = require("express");
const cors = require("cors");
const app = express();
require("./../database/mongo.js");

app.use(cors());
app.use(express.json()); //Permet de parser le JSON du body
app.use("/images", express.static("uploads"));

module.exports = { app };
