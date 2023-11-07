const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Image extends Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: "Image",
        tableName: "images",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Image.belongsTo(db.Post);
  }
};

// //이러한 모든 작업을 원래는 SQL해야하지만 sequelizer로 js 코드로 만들 수 있게 해준다
// module.exports = (sequelize, DataTypes) => {
//   const Image = sequelize.define(
//     "Image",
//     {
//       src: {
//         type: DataTypes.STRING(200), //image는 url이기 때문에 엄청 길어질 수 있기 때문에 200글자로 제한
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8",
//       collate: "utf8_general_ci",
//     }
//   );
//   Image.associate = (db) => {
//     db.Image.belongsTo(db.Post);
//   };
//   return Image;
// };
