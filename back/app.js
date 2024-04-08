//노드가 서버를 해주는 게 아니라 이 http가 해주는 것이다
//express는 이러한 노드의 작업을 깔끔하게 해주는 framework라고 생각하면 된다
//서버를 돌릴려면 이렇게 http가 가능해야 하는데 express도 가능하다, 즉 노드에서 제공하는 http 모듈이 서버라고 생각하면 된다
/////////////node js////////////////////
// const http = require("http");
// const server = http.createServer((req, res) => {
//   console.log(req.rul, res.method);
//   //이런식으로 html 태그도 넣을 수 있다
//   res.write("<h1>hello node1</h1>");
//   res.write("<h2>hello node2</h2>");
//   res.write("hello node3");
//   res.write("hello node4");
//   res.write("hello node5");
//   res.end("hello node");
//   //res.end는 두번 사용하면 안 된다
// });

//////////////express////////////////////
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

dotenv.config();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());
app.use(passport.session());

passportConfig();
app.use(morgan("dev"));

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>hello express</h1>");
});

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});
