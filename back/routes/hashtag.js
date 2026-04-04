const express = require("express");
const router = express.Router();
const { Post, Hashtag, Image, Comment, User } = require("../models");
const { Op } = require("sequelize");
const { getPostFeedIncludes } = require("./postFeedIncludes");

router.get("/:hashtag", async (req, res, next) => {
  try {
    const hashtag = await Hashtag.findOne({
      where: { name: req.params.hashtag },
    });
    if (!hashtag) {
      return res.status(404).json({ message: "해시태그가 존재하지 않습니다." });
    }

    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
        },
        ...getPostFeedIncludes({ User, Image, Comment, Post }),
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
