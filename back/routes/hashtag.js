const express = require("express");
const router = express.Router();
const { Post, Hashtag, Image, Comment, User } = require("../models");
const { Op } = require("sequelize");

router.get("/:hashtag", async (req, res, next) => {
  //Get /hashtag/노드
  try {
    const where = {};
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
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
        },
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

module.exports = router;
