const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passportConfig = require("./passport");
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");

dotenv.config();

db.sequelize
  .sync()
  .then(() => {
    console.log("Connected DB successfully!!");
  })
  .catch(console.error);

passportConfig();

// For production mode

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      // origin: ["https://portfolio-simon.com"],
      origin: "*",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    // proxy: true,
    cookie: {
      httpOnly: true,
      secure: false,
      domain:
        process.env.NODE_ENV === "production"
          ? ".portfolio-simon.com"
          : "localhost",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>hello express</h1>");
});

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

app.listen(3065, () => {
  console.log("Server is running on port 3065");
});
