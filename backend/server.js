const express = require("express");
const app = express();
const { User, Book } = require("./database/mongo"); // permet de ce connecter avec la Database mongo
const cors = require("cors");
const bcrypt = require("bcrypt");
const { books } = require("./database/books");
const multer = require("multer");

const PORT = 4000; // indication du port utiliser

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase() + Date.now() + ".jpg";
    cb(null, Date.now() + "-" + fileName);
  },
});

const upload = multer({
  storage: storage,
});

app.use(cors());
app.use(express.json()); //Permet de parser le JSON du body
app.use("/images", express.static("uploads"));

function sayHi(req, res) {
  res.send("Hello Word");
}

//Permet de hasher le mot de passe dans la basse de données
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10); //Permet de changer le hash meme si 2 utilisateur on le meme Mot de passe
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

// fonction pour l'inscription au site
async function signUp(req, res) {
  const email = req.body.email; // recupere l'email de la requete
  const password = req.body.password;

  const userInDb = await User.findOne({
    email: email,
  });

  if (userInDb != null) {
    // renvoi un message d'erreur si un email est deja inscrit
    res.status(400).send("Email ou Mot de passe deja existant");
    return; // si un email est deja inscrit alors tu stope la fonction
  }

  const user = {
    email: email, // recupere l'email de la const email
    password: hashPassword(password),
  };

  try {
    await User.create(user); // cree un nouvelle utilisateur dans la base de données
  } catch (e) {
    console.error(e);
    res.status(500).send("Quelque chose s'est mal passé"); // annonce une erreur coté serveur
    return;
  }

  res.send("Sign Up");
}

// fonction pour la connexion au site
async function login(req, res) {
  const body = req.body;

  const userInDb = await User.findOne({
    email: body.email,
  });

  if (userInDb == null) {
    res.status(401).send("Email ou Mot de passe deja existant");
    return;
  }

  const passwordInDb = userInDb.password;
  if (!isPasswordCorrect(req.body.password, passwordInDb)) {
    res.status(401).send("Email ou Mot de passe deja existant");
    return;
  }
  res.send({
    userId: userInDb._id,
    token: "token",
  });
}

//compare le mot de passe initial et le mot de passe hasher
function isPasswordCorrect(password, hash) {
  return bcrypt.compareSync(password, hash);
}

//permet de récupérer tous les livres en DB
function getBooks(req, res) {
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

// API
app.get("/", sayHi);
app.post("/api/auth/signup", signUp); // Requete POST pour l'incription
app.post("/api/auth/login", login); // Requete POST pour la connexion
app.get("/api/books", getBooks); // Requete GET pour les livres
app.post("/api/books", upload.single("image"), postBooks); //Requete POST pour les livres

app.listen(PORT, function () {
  console.log(`Server is running on: ${PORT}`);
});
