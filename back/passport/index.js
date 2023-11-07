const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  //사용자의 id만 저장
  passport.serializeUser((user, done) => {
    //백엔드 서버에서 쿠키랑 함께 id만 저장할 코드, 세션에 다 들고 있기 무겁기 때문에
    done(null, user.id);
    //첫번째 인자는 서버에러이고 두번째가 성공여부이다
  });

  //serialize를 통해서 저장한 id를 유용해서 해당 유저의 데이터를 db에서 불러오는 동작
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); //req.user에 넣어줌
    } catch (error) {
      console.log(error);
      done(error);
    }
  });

  local();
};
