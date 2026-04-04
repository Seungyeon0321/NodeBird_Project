/**
 * 피드/목록용 Post.findAll include 공통 설정.
 * Comment(hasMany)만 separate 조회 — Likers는 belongsToMany라 Sequelize에서 separate 미지원.
 */
function getPostFeedIncludes({ User, Image, Comment, Post }) {
  return [
    {
      model: User,
      attributes: ["id", "nickname"],
    },
    {
      model: Image,
    },
    {
      model: Comment,
      separate: true,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "nickname"] }],
    },
    {
      model: User,
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
  ];
}

module.exports = { getPostFeedIncludes };
