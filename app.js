const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const bodyParse = require("body-parser");
const publicRouter = require("./src/routers/publicRouter");

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views")]);

app.use("/", publicRouter);

app.listen(PORT, () => {
  console.log(`Server : http://localhost:${PORT}`);
});
