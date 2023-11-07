const passport = require("passport");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        //만약 우리가 front에서 받는 데이터 name이
        //req.body.id면 유저네임 필드에 'email'이 아니라 'id'가 들어가야한다
        usernameField: "email",
        passwordField: "userPassword",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            return done(null, false, { reason: "This user doesn't exist" });
            //done의 매개변수는 1. 서버에러 2. 성공여부 3. 클라이언트 에러 (보내는측에서 잘못된 요청이 있는 걸 의미함)
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
            //비밀번호가 성공하면 사용자 정보를 넘겨줌
          }
          return done(null, false, { reason: "the password is not correct" });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};

//해당 코드는 index.js에서 local() 부분에서 실행되며
//index.js에 있는 나머지 녀석은 app.js에서 실행된다고 보면 된다
