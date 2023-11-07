const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: "Hashtag",
        tableName: "hashtag",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define(
//     "Hashtag",
//     {
//       //id같은 경우에는 Mysql이 자동적으로 넣어준다
//       name: {
//         type: DataTypes.STRING(20),
//         allowNull: false,
//       },
//     },
//     {
//       //mb4를 넣어줌으로써 게시글에 이모티콘이 들어올 수 있게 설정해준다
//       charset: "utf8mb4",
//       collate: "utf8mb4_general_ci",
//     }
//   );
//   Hashtag.associate = (db) => {
//     db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
//     //Hashtag와 Post 중간에 들어갈 녀석의 이름이 이 through에 들어간다
//   };
//   return Hashtag;
// };
