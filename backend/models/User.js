const mongoose = require("mongoose");

//Shema des données pour les Users
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//Création du model pour la base de donnée
const User = mongoose.model("User", UserSchema);

module.exports = { User };
