const { app } = require("./config/app");
const { upload } = require("./middlewares/multer");
const { signUp, login } = require("./controller/user.controller");
const { postBooks, getBooks } = require("./controller/books.controller");

const PORT = process.env.PORT || 4000; // indication du port utiliser

// API
app.get("/", (req, res) => res.send("Server en route !"));
app.post("/api/auth/signup", signUp); // Requete POST pour l'incription
app.post("/api/auth/login", login); // Requete POST pour la connexion
app.get("/api/books", getBooks); // Requete GET pour les livres
app.post("/api/books", upload.single("image"), postBooks); //Requete POST pour les livres

app.listen(PORT, function () {
  console.log(`Server is running on: ${PORT}`);
});
