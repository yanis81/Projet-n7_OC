const { app } = require("./config/app");
const { upload } = require("./middlewares/multer");
const { signUp, login } = require("./controller/user.controller");
const { postBooks, getBooks, getBookById, checkToken } = require("./controller/books.controller");

const PORT = process.env.PORT || 4000; // indication du port utiliser

// ------------API-ROUTER---------------
//API GET
app.get("/", (req, res) => res.send("Server en route !"));
app.get("/api/books", getBooks); // Requete GET pour charger tous les livres de la DB
app.get("/api/books/:id", getBookById) //requte GET 
//API POST
app.post("/api/auth/signup", signUp); // Requete POST pour s'inscrire
app.post("/api/auth/login", login); // Requete POST pour ce connecter
app.post("/api/books", checkToken, upload.single("image"), postBooks); //Requete POST pour poster les nouveaux livres

app.listen(PORT, function () {
  console.log(`Server is running on: ${PORT}`);
});
