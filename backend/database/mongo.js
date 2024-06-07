require("dotenv").config();
const mongoose = require("mongoose");



const DB_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_DOMAIN}`;

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

//Shema des données pour les Users
 const UserSchema = new mongoose.Schema({
   email: String,
   password: String
  });
//Création du model pour la base de donnée 
const User = mongoose.model("User",UserSchema);

//Shema des données pour les livres
const BookShema = new mongoose.Schema({
  userId: String,
  title: String,
  author: String,
  year: Number,
  genre: String,
  ratings: [
    {
      userId: String,
      grade: Number
    }
  ],
  averageRating:Number  
});
//Création du model pour la base de donnée 
 const Book = mongoose.model("Book",BookShema)

module.exports = { User, Book };
