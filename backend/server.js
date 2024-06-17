require("dotenv").config();
const { app } = require("./config/app");
const { usersRouter } = require("./controller/user.controller");
const { booksRouter } = require("./controller/books.controller");

const PORT = process.env.PORT || 4000; // indication du port utiliser

app.get("/", (req, res) => res.send("Server en route !"));

app.use("/api/auth", usersRouter);
app.use("/api/books", booksRouter);

app.listen(PORT, function () {
  console.log(`Server en route sur le port: ${PORT}`);
}); 