const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User); //Post는 유저한테 종속되기 때문에 //post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); //다 대 다 관계이기 때문에 // post.addHashtags
    db.Post.hasMany(db.Comment); //post.addComments, post.getComments
    db.Post.hasMany(db.Image); //post.addImages post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //as는 하나의 위에 Post belongsTo User와의 관계를 구별짓기 위해 써놓는 녀석이다
    //as를 추가함에 따라 post.addLikers라는 녀석이 생긴다
    db.Post.belongsTo(db.Post, { as: "Retweet" }); //post.addRetweet
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define(
//     "Post",
//     {
//       //id같은 경우에는 Mysql이 자동적으로 넣어준다
//       content: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//     },
//     {
//       //mb4를 넣어줌으로써 게시글에 이모티콘이 들어올 수 있게 설정해준다
//       charset: "utf8mb4",
//       collate: "utf8mb4_general_ci",
//     }
//   );
//   Post.associate = (db) => {
//     db.Post.belongsTo(db.User); //Post는 유저한테 종속되기 때문에 //post.addUser, post.getUser, post.setUser
//     db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); //다 대 다 관계이기 때문에 // post.addHashtags
//     db.Post.hasMany(db.Comment); //post.addComments, post.getComments
//     db.Post.hasMany(db.Image); //post.addImages post.getImages
//     db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //as는 하나의 위에 Post belongsTo User와의 관계를 구별짓기 위해 써놓는 녀석이다
//     //as를 추가함에 따라 post.addLikers라는 녀석이 생긴다
//     db.Post.belongsTo(db.Post, { as: "Retweet" }); //post.addRetweet
//   };
//   return Post;
// };

// //먼저 이 belongsTo가 어디서 왔는지부터 알아봐야해
