const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(30), //STRING뿐만 아니라 다른 타입도 들어갈 수 있다
          allowNull: false, //필수 여부, 필수일 경우 false
          unique: true, //고유한 값
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId",
    });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "User",
//     {
//       //여기 모델에서는 User라고 대문자로 저장하지만 mySQL에는 users
//       //라는 이름으로 테이블을 생성하게 된다.

//       //id같은 경우에는 Mysql이 자동적으로 넣어준다
//       //여기 각 유저의 데이터가 가로인 row라고 생각하면 되고 해당
//       //유저들이 세로인 colum이라고 생각하면 된다.

//       // 가로의 정보를 정의하고 있고 해당 정보를 받을 때의 조건을 설정하고 있음
//       email: {
//         type: DataTypes.STRING(30), //STRING뿐만 아니라 다른 타입도 들어갈 수 있다
//         allowNull: false, //필수 여부, 필수일 경우 false
//         unique: true, //고유한 값
//       },
//       nickname: {
//         type: DataTypes.STRING(30),
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING(100), //password는 왜 100글자일까? 패스워드는 그대로 받는게 아니라 써놓은 녀석에서 암호화를 하기 때문에 이렇게 길어진다
//         allowNull: false,
//       },
//     },
//     //이 두번째 객체는 user모델에 대한 셋팅을 해줘야한다
//     {
//       //이런식으로 해야 한글을 저장할 수 있기 때문에 해당 데이터 타입을 넣는 것이다
//       charset: "utf8",
//       collate: "utf8_general_ci",
//     }
//   );

//   User.associate = (db) => {
//     db.User.hasMany(db.Post); //이게 일대다 관계를 만드는 방식 다가 보통 매개변수로 들어가게 된다
//     db.User.hasMany(db.Comment);
//     //유저와 유저정보는 일대일 관계이기 때문에 User.hasOne이 된다
//     db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); //사용자와 좋아요의 관계
//     //만약 1이라는 유저가 팔로잉한 사람을 찾아라 했을 때, 일단 follower에서 1를 먼저 찾고 그 1이 following한 것을 찾아야 한다.
//     //그래서 foreignkey를 반대로 가지고 간다, 여기서 foreignkey가 존재하는
//     //이유는 위에 같은 경우는 중간 db에 postId, userId가 생기는 반면,
//     //아래의 예는 둘다 userId이기 때문에 이 둘을 구분해주기 위해 이름을 다시
//     //짖는 행위라고 보면 된다
//     db.User.belongsToMany(db.User, {
//       through: "Follow",
//       as: "Followers",
//       foreignKey: "followingId",
//     });
//     db.User.belongsToMany(db.User, {
//       through: "Follow",
//       as: "Followings",
//       foreignKey: "followerId",
//       //as랑 foreignKey를 반대로 생각하면 좋다
//     });
//   };
//   return User;
// };
// //여기 associate는 sequelize을 이용해서 만들어놓은 models의 관계들이 들어간다
// //예를 들어서 유저가 적은 게시글이라던지 헤쉬테그와 관련한 게시글이라던지,
// //모델과 모델과의 관계가 있는 것을 말한다
// //MySQL은 그래서 관계형 데이터베이스라고 한다
