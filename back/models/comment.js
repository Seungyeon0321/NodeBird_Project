const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "Comment",
        tableName: "comments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};

///////////위에 있는 문법이 최신 문법임//////////////

// module.exports = (sequelize, DataTypes) => {
//   const Comment = sequelize.define(
//     "Comment",
//     {
//       //id같은 경우에는 Mysql이 자동적으로 넣어준다
//       content: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//     },
//     //이 두번째 객체는 user객체에 대한 셋팅을 해줘야한다

//     //belongsTo가 있으면 아래와 같은 colum이 생긴다고 보면 된다
//     //UserID: 1,
//     //PostID: 33
//     {
//       //mb4를 넣어줌으로써 게시글에 이모티콘이 들어올 수 있게 설정해준다
//       charset: "utf8mb4",
//       collate: "utf8mb4_general_ci",
//     }
//   );
//   Comment.associate = (db) => {
//     db.Comment.belongsTo(db.User); //belongsTo라는 메소드를 사용하면 실제 colum이 생겨 그 아이디에 따라 올바르게 작동한다
//     db.Comment.belongsTo(db.Post);
//   };
//   return Comment;
// };
