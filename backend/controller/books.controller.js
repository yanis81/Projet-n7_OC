const { Book } = require("../models/Book");
const express = require("express");
const { upload } = require("../middlewares/multer");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

//Routeur API books
const booksRouter = express.Router();
booksRouter.get("/bestrating", getBestRating);
booksRouter.get("/:id", getBookById);
booksRouter.get("/", getBooks);
booksRouter.post("/", checkToken, upload.single("image"), postBook);
booksRouter.delete("/:id", checkToken, deleteBook);
booksRouter.put("/:id", checkToken, upload.single("image"), putBook);
booksRouter.post("/:id/rating", checkToken, postRating);

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
      return;
    }
    book.imageUrl = "http://localhost:4000/images/" + book.imageUrl;
    res.send(book);
  } catch (e) {
    console.log(e);
    res.status(500).send("quelque chose a mal tourner : " + e.message);
  }
}

//permet de poster de nouveaux livres
async function postBook(req, res) {
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

//Permet de vérifier le token d'autorisation
function checkToken(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (authorization == null) {
    res.status(401).send("Pas d'autorisation");
    return;
  }
  const token = authorization.split(" ")[1];
  try {
    const jwtSecret = String(process.env.JWT_SECRET);
    const tokenPayload = jwt.verify(token, jwtSecret);
    if (tokenPayload == null) {
      res.status(401).send("pas d'autorisation");
      return;
    }
    req.tokenPayload = tokenPayload;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("pas d'autorisation");
  }
}

//permet de supprimer un livre
async function deleteBook(req, res) {
  const id = req.params.id;
  try {
    const bookInDb = await Book.findById(id);
    if (bookInDb == null) {
      res.status(404).send("Livres pas trouver");
      return;
    }
    const userIdInDb = bookInDb.userId;
    const userIdInToken = req.tokenPayload.userId;
    if (userIdInDb != userIdInToken) {
      res
        .status(403)
        .send("vous ne pouvez pas supprimer un livre d'une autre personne");
      return;
    }
    await Book.findByIdAndDelete(id);
    res.send("Livre supprimer !");
  } catch (e) {
    console.error(e);
    res.status(500).send("nous avons une erreur:" + e.message);
  }
}

//permet de modifier un livre
async function putBook(req, res) {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.file.filename}`,
  } : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      
          if (req.file) {
              const imagePath = path.join( path.basename(book.imageUrl));
              fs.unlink(imagePath, (error) => {
                if (error) {
                  console.log(error);
                }
              });
          }
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre modifié!' }))
            .catch((error) => res.status(401).json({ error }));
    })
    .catch((e) => {
      console.error(e)
      res.status(400).send("nous avons une erreur:" + e.message);
    });
}

//permet de montrer les livres les mieux noter
async function getBestRating(req, res) {
  try {
    const booksWithBestRatings = await Book.find().sort({ averageRating: -1 }).limit(3); //seulement 3 livres
    booksWithBestRatings.forEach((book) => {
      book.imageUrl = "http://localhost:4000/images/" + book.imageUrl;
    });
    res.send(booksWithBestRatings);
  } catch (e) {
    console.error(e);
    res.status(500).send("nous avons une erreur:" + e.message);
  }
}

//permet de poster une note a un livre 
async function postRating(req, res) {
  const id = req.params.id;
  if (id == null || id == "undefined") {
    res.status(400).send("l’identifiant du livre est manquant");
    return;
  }
  const rating = req.body.rating;
  const userId = req.tokenPayload.userId;
  try {
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Livre pas trouver");
      return;
    }
    const ratingsInDb = book.ratings;
    const previousRatingFromCurrentUser = ratingsInDb.find((rating) => rating.userId === userId);
    if (previousRatingFromCurrentUser != null) {
      res.status(400).send("Vous avez deja noter ce livre");
      return;
    }
    const newRating = { userId, grade: rating };
    ratingsInDb.push(newRating);
    book.averageRating = calculateAverageRating(ratingsInDb);
    await book.save();
    res.send("Note poster");
  } catch (e) {
    console.error(e);
    res.status(500).send("nous avons une erreur:" + e.message);
  }
}

//permet de calculer la note général du livre
function calculateAverageRating(ratings) {
  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  return sumOfAllGrades / ratings.length;
}

module.exports = { booksRouter };
