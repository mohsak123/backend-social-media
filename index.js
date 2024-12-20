const express = require("express");
const connectToDB = require("./config/connectToDB");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

// connect to mongodb
connectToDB();

const app = express();
const cors = require("cors");

app.use(express.static(path.join(__dirname, "public")));

// Middlewares
// app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());

// MiddleWares (Router)
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));

// MiddleWare - Handle error file too large for images
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({ message: "File size exceeds limit" });
  } else {
    // Handle other errors or pass them to the default error handler
    next(err);
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
