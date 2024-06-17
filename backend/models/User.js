const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Shema des données pour les Users
const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

UserSchema.plugin(uniqueValidator);

//Création du model pour la base de donnée
const User = mongoose.model("User", UserSchema);

module.exports = { User };
