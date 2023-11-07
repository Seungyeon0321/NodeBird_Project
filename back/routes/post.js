//노드에서는 import, export를 쓰지 않기 때문에 이렇게
//require을 쓴다, 사실 지원은 하지만 잘 안쓴다
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Comment, Image, User, Hashtag } = require("../models");

const { isLoggedIn } = require("./middlewares");

const router = express.Router();
//이렇게 url이 겹치는 녀석은 이렇게 다른 폴더의 파일에 넣어서 router로 따로 정의한다, 그리고 이 녀석들은 app.js로 import한다는 느낌이다

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없음으로 생성합니다");
  fs.mkdirSync("uploads");
}

//////////////////////이미지 관련 작업/////////////////////
//multer은 그 파일의 형식마다 form이 다르기 때문에 각 라우터
//마다 개별적으로 셋팅을 해줘야 한다. 지금은 하드에다가 저장하지만 나중에는 아마존에다가 저장하게 될 것이다
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      //제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 제로초

      done(null, basename + "_" + new Date().getTime() + ext);
      //이렇게 파일명을 저장하면 같은 이름이라도 먼저 저장한 파일이 덮여쓰이는 일을 방지할 수 있다
    },
  }),
  limits: { fieldNameSize: 20 * 1024 * 1024 }, //20MB
  //동영상같은 경우는 이렇게 서버를 거치지 않고 바로 프론트에서 클라우드로 올릴 수 있게 하는데 그 방법을 이용하는 것이 서버를 거치면서 드는 비용을 절감할 수 있다
});

//매번 이 리퀘스트를 보내지만 만약 로그아웃이 된 상태라면 req.user.id가 없기 때문에 오류가 나기 마련이다, 그렇기 때문에 이를 방지하고 위해서 if (req.user)가 있을 때만 해당 코드가 작동하게 해준다

//isLoggedIn을 끼워넣음으로써 로그인 된 상태에서만 포스팅,
//코맨트를 달 수 있도록 한다
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // model을 이용해서 그 녀석에 get, create등등의 메서드를 이용하여
  // 게시글이 backend에 저장할 수 있도록 한다

  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        //이미 등록한 hashtag가 있으면 찾고 없으면 생성
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );
      //[[#노드, true], [#리액트, true]] result의 결과 모양이 이렇게 때문에 해당 문자만 빼오기 위해 인덱스 0을 붙인다
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        //이미지를 여러개 올릴 경우 image: [승연.png, 창주png], 이 경우 db는 파일 주소만 가지고 있지 파일 자체를 가지고 있지는 않는다, db에 넣게 되면 파일을 캐싱도 못한다, 그래서 db는 그 파일에 접근할 수 있는 주소만 가지고 있는다

        //sequelizer부분은 대문자에 주의
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        //이미지를 하나만 올리게 되면 image: 승연.png 이런식으로 배열이 아니라 주소로 된다
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      //게시글에 달릴 녀석들
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, //댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    //json을 이용해서 실제로 해당 post를 front에 돌려줘야 함.
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"), //한장만 올리게 되면 single이 된다
  async (req, res, next) => {
    ㅋ;
    //이 async는 이미지 업로드 후에 작동하게 된다, 이 부분은 이미지 업로드를 위한 multer 강의 참조
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  }
);

///////////////////////////////////////////////////

router.get("/:postId", async (req, res, next) => {
  //GET //post/1
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send("데이터가 없음");
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
        {
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
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });

    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    //retweet할 때는 post를 꼭 찾아줘야 한다,
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });

    if (!post) {
      return res.status(403).send("no exist comments");
    }

    //내가 쓴 글을 다시 리트윗하는 거랑 남이 내 글을 트윗한 것을 또 트윗하는 것을 방지한다
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다");
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    //리트윗한거를 또 리트윗하는건 막아야하기 때문에
    if (exPost) {
      return res.status(403).send("이미 트윗함");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id }, //40
      include: [
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
        {
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
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });

    res.status(200).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//////////////////////////////////

//가변적으로 바뀌는 부분은 parameter로 이런식으로 바꿔준다
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // model을 이용해서 그 녀석에 get, create등등의 메서드를 이용하여
  // 게시글이 backend에 저장할 수 있도록 한다
  try {
    //만약 해당 postId/comment의 url로 직접들어가 해당 코멘트를 직접 조작할 수 있는 우려가 있기 때문에 실제로 해당 post가 있는지 확인해야 한다.
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("no exist comments");
    }

    //req.params로 받는 녀석은 문자열로 오기 대문에 숫자로 바꿔야 한다
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    //json을 이용해서 실제로 해당 post를 front에 돌려줘야 함.
    res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  //PATCH /post/1/like
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("The post does not exist");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  //DELETE /post/1/like
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("The post does not exist");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//여기 prefix의 녀석은 app.js의 use.postRouter의 매개변수로 넣어준 녀석이 오게 된다
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1

  try {
    //sequelize에서는 destroy를 쓴다
    await Post.destroy({
      //게시글이 id와 그 쓴 글이 내가 쓴 글이어야한다
      //작성하고 지우고 하는 기능을 보안을 철처히 해야한다
      //여기 params는 뒤에 들어오는 녀석이랑 동일해야함, PostId 이렇게 하면 에러 발생
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
