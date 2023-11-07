const express = require("express");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, Post, Image, Comment } = require("../models");
const passport = require("passport");
//db.User이다
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();
//models에서 넘어오는 녀석은 req프롬에서 받아올 수 있다
//비동기적으로 처리해야한다
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        //이 부분은 associate에 들어간 그대로 들어간다
        include: [
          {
            //post의 모든 데이터를 가지고 오기 때문에 id만 가지고 오도록 attributes를 설정
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//////미들웨어 확장////////////
router.post(
  "/login",
  isNotLoggedIn,
  //passport에서 null, false, user의 매개변수가 여기로 전달됨
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }
        //모든 유저 id가 들어있는 변수
        const fullUserWithoutPassword = await User.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ["password"],
          },
          //이 부분은 associate에 들어간 그대로 들어간다
          include: [
            {
              model: Post,
            },
            {
              model: User,
              as: "Followings",
            },
            {
              model: User,
              as: "Followers",
            },
          ],
        });
        return res.status(200).json(fullUserWithoutPassword); //이 부분을 통해서 data가 전송된다
      });
    })(req, res, next);
  }
);

//req, res, next를 사용 못하기 때문에 함수에 또 다른 함수를 넣어서 사용할 수 있도록 설정

router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    //회원 가입할 시에 user email이 중복이 되어있는지를 체크를 해줘야 하기 때문에 이 부분을 findOne을 찾아야 한다
    const exUser = await User.findOne({
      //조건을 이렇게 where에다가 작성
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
      //여기서 return을 안해주면 send가 여기서 한 번 뒤에서 한번 더 하기 때문에 에러가 난다 "can't set headers already sent"
      //요청/응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터)로 구성되어 있음
      //200 성공, 300 리다이렉트, 400 클라이언트 에러, 500 서버 에러
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //숫자는 10에서 13사이로 설정, 숫자가 높을수록 보안등급은 높지만 해석하는데 시간이 걸림
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword, //비밀번호를 이대로 그냥 쓰면 안되기 때문에 라이브러리를 사용 npm i bcrypt
    });
    //이런식으로 CORS를 처리할 수 있지만 cors를 설치해서 처리하기도한다
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3060");
    res.status(201).send("ok!");
  } catch (error) {
    console.error("error!");
    next(error); //next를 통해서 error을 보내면 error가 한방에 처리된다
    //status 500 서버쪽에서 처리하다가 오류가 났기 때문에
  }
});

// 로그 아웃같은 경우는 세션 지우고 쿠키 지우면 끝이기 때문에 간단하다
// router.post("/logout", (req, res, next) => {
//   console.log(req);
//   req.logout(req.user, (err) => {
//     if (err) return next(err);
//     res.redirect("/");
//   });

//   req.session.destroy((err) => {
//     if (err) {
//       return next(err);
//     }
//   });

//   res.send("ok");
// });

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout(() => {
    res.send("ok");
  });
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    //두번째 객체에 누구 nickname을 수정할건지를 찾아야 한다, 당연히 내 아이디이니까, 첫번째 인자는 프론트에서 받게 될 녀석임
    User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch {}
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // Get //user/followers
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      res.status(403).send("The user does not exist!");
    }

    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit),
    });

    res.status(200).json(followers); // 이 부분이 action.data로 들어오는 부분임
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // Get //user/followings
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      res.status(403).send("The user does not exist!");
    }

    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit),
    });
    res.status(200).json(followings); // 이 부분이 action.data로 들어오는 부분임
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH //user/1/follow

  //먼저 following할 유저가 있는지 찾아야 한다.

  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("The user does not exist!");
    }
    await user.addFollowers(req.user.id);

    //상대방 id가 보내져야 한다, 즉 followings
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE //user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("The user does not exist!");
    }

    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // 이 부분이 action.data로 들어오는 부분임
  } catch (error) {
    console.error(error);
    next(error);
  }
});

////////////////특정 사용자의 게시물만 가지고 오기//
router.get("/:userId/posts", async (req, res, next) => {
  //Get /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      //post를 다 가지고 오지 않고 특정 갯수에 따라 가지고 오게 된다
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      // offset: 0,
      //offset이 0 이면 0부터 limit을 갯수(10)까지 가지고 와라, 100이면 100부터 110번까지 가지고 오게 할 수 있다, 하지만 이 방법은 실무에서 잘 안쓴다, 왜냐하면 로딩 도중에 게시글이 추가 삭제 되면 불러오는 offset과 limit이 꼬이기 때문에 lastId 방식을 사용한다
      include: [
        {
          //User 정보를 가지고 올때 가지고 비밀번호를 가지고 오면 안되기 때문에 이렇게 두개만 가지고 오게 한다
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE //user/follower/2
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("The user does not exist!");
    }

    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // 이 부분이 action.data로 들어오는 부분임
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  // GET /user/1

  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      //이 부분은 associate에 들어간 그대로 들어간다
      include: [
        {
          //post의 모든 데이터를 가지고 오기 때문에 id만 가지고 오도록 attributes를 설정
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });

    if (fullUserWithoutPassword) {
      //sequelize에서 보낸온 녀석은 JSON이 아니기 때문에 한번 바꿔줘야함
      const data = fullUserWithoutPassword.toJSON();
      //백엔드에서 넣은 이유는 해당 length를 포함해서 post id와 팔로워 팔로잉 정보를 다 얻을 수 있기 때문에 redux를 사용해서 브라우저를 통해
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get("/followings", isLoggedIn, async (req, res, next) => {
//   // Get //user/followings
//   try {
//     const user = await User.findOne({
//       where: { id: req.user.id },
//     });
//     if (!user) {
//       res.status(403).send("The user does not exist!");
//     }

//     const followings = await user.getfollowings();

//     res.status(200).json(followings); // 이 부분이 action.data로 들어오는 부분임
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;
