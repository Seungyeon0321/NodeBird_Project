// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

const Sequelize = require("sequelize");
//env 환경 설정이라는 데 이게 무슨 말일까?
const comment = require("./comment");
const hashtag = require("./hashtag");
const image = require("./image");
const user = require("./user");
const post = require("./post");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

// 이렇게 하면 sequelize가 node와 mysql을 연결해줌
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
  {
    dialect: config.dialect,
  }
);

db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//이렇게 해줌으로써 sequelize가 node랑
//mySQL을 연결해주는 역활을 한다,
//sequalizer가 mysql2라는 드라이버같은
//녀석을 이용해서 서로 이어준다

module.exports = db;
