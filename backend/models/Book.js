const mongoose = require("mongoose");

//Shema des données pour les livres
const BookShema = new mongoose.Schema({
  userId: String,
  title: String,
  author: String,
  imageURL: String,
  year: Number,
  genre: String,
  ratings: [
    {
      userId: String,
      grade: Number,
    },
  ],
  averageRating: Number,
});

//Création du model pour la base de donnée
const Book = mongoose.model("Book", BookShema);

module.exports = { Book };
