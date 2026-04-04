const express = require("express");

const { Post, User, Image, Comment } = require("../models");
const { Op } = require("sequelize");
const { getPostFeedIncludes } = require("./postFeedIncludes");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: getPostFeedIncludes({ User, Image, Comment, Post }),
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
