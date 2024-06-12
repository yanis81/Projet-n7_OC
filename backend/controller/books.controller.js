const { Book } = require("../models/Book");

//permet de récupérer tous les livres de la DB
async function getBooks(req, res) {
  const books = await Book.find();
  res.send(books);
}

//permet de poster de nouveaux livres
async function postBooks(req, res) {
  const file = req.file;
  const stringifiedBook = req.body.book;
  const book = JSON.parse(stringifiedBook); //parse les données du livre en JSON
  book.imageURL = file.path;
  try {
    const result = await Book.create(book); //crée le livre dans la base de donnée
    res.send({ message: "Livre enregistrer", book: result }); //renvoi un message de confirmation et les detail du livre poster
  } catch (e) {
    console.log(e);
    res.status(500).send("quelque chose a mal tourner" + e.message); //permet d'eviter les crash du server et d'avoir un message des que ça ne vas pas
  }
}

module.exports = { postBooks, getBooks };
