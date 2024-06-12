const { Book } = require("../models/Book");

//permet de récupérer tous les livres de la DB
async function getBooks(req, res) {
  const books = await Book.find();
  books.forEach((book) => {
    book.imageUrl = "http://localhost:4000/images/" + book.imageUrl;
  });
  res.send(books);
}

//permet d'acceder a un livre particulier avec l'ID
async function getBookById(req, res) {
  const id = req.params.id;
  try {
    const book = await Book.findById(id);
    if (book == null) {
    res.status(404).send("livre pas trouver");
    return
    } 
    book.imageUrl = "http://localhost:4000/images/" + book.imageUrl;
    res.send(book);
  }
   catch (e) {
    console.log(e);
    res.status(500).send("quelque chose a mal tourner : " + e.message);
  }
  
}

//permet de poster de nouveaux livres
async function postBooks(req, res) {
  const stringifiedBook = req.body.book;
  const book = JSON.parse(stringifiedBook); //parse les données du livre en JSON
  const filename = req.file.filename;
  book.imageUrl = filename;
  try {
    const result = await Book.create(book); //crée le livre dans la base de donnée
    res.send({ message: "Livre enregistrer", book: result }); //renvoi un message de confirmation et les detail du livre poster
  } catch (e) {
    console.log(e);
    res.status(500).send("quelque chose a mal tourner" + e.message); //permet d'eviter les crash du server et d'avoir un message des que ça ne vas pas
  }
}

module.exports = { postBooks, getBooks, getBookById };
