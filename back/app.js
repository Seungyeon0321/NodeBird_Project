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

passportConfig();
app.use(morgan("dev"));
//이녀석들이 front에서 넘어오는 data를 해석해서 routes user의 req.body로 데이터를 넣어준다, 최대한 위에 있어야 함 (해당 부분이 middle ware인데 아직 잘 모르겠음)
app.use(express.json()); //front에서 json파일이 넘어오면 그 파일을 req.body에 넣어주게 되고
app.use(
  cors({
    origin: true, //origin: true로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리함
    credentials: true,
  })
);
//이 static을 이용하면 사진 미리보기가 가능해진다
//path.join을 사용하는 이유는 운영체제에 따라 파일 이름이 바뀌기 때문에 단순히 __dirname + "uploads" 이렇게 못 지은다
//그리고 앞에 오는 '/' localhost:3065가 된다
//이렇게 하면 좋은게 프론트에서는 /을 이용해서 해당 사진에 접근
//할 수 있는 점이다. 그렇기 때문에 프론트에서는 서버쪽 폴더 구조를 잘 모른다 (보안에 좀 더 유용한 이점이 있다)
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true })); //form submit했을 때 url 인코딩 방식으로 넘어오게 됨
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

//여기서 get이 url이고 /가 method이다
app.get("/", (req, res) => {
  res.send("<h1>hello express</h1>");
});

//이런식으로 if문을 안쓰고 만들어줄 수 있다

//post랑 delete요청은 이렇게 api주소로는 할 수 없다, 이건 get이기 때문에

//이런식으로 다른 파일안에 있는 라우터를 가지고 옴으로써 라우터를 분리시킬 수 있음, 중복되는 녀석의 주소를 이렇게 처음 매개변수로 대입

//여기 post and user가 prefix로 붙고 그 다음 주소가 router 안에 있는 라우터의 주소가 오게 됨 예를 들어서 postRouter안에 post라는 router가 있게 되면 실제 주소는 post/post가 됨

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});

// 서버의 기본 프론트에서 요청을 해주면 back에서 응답을 해준다가 기본 원리이다
// 응답을 안 보내면 특정 시간(30초 정도)후에 브라우저가 자동으로 응답 실패로 처리해버립니다
//여러개의 파일이 필요할때는 한번의 요청에 대비해, 여러개의 파일을 묶어서 응답을 보내거나 아니면 요청을 여러번 보내서 그 요청에 맞게 데이터를 묶어서 보내던가 해야한다

//라우터가 다양한 이유가 프론트에서 여러가지 다양한 상황에서 데이터를 요구하기 때문에 거기에 맞춰서 데이터를 보내줘야 하기 때문에 여러가지 라우터를 필요로 한다 (하나의 요청은 하나의 응답만 할 수 있기 때문에!)
