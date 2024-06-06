require("dotenv").config();
const mongoose = require("mongoose");


const DB_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_DOMAIN}`;

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));


const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User",UserSchema);

module.exports = { User };
