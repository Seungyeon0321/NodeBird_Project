//여기서 isAuthenticated는 password에서 보내게 되는 녀석이다

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    //이렇게 err 없이 next를 하게 되면 다음 미들웨어로 가게 된다
  } else {
    res.status(401).send("you need to login");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
    //이렇게 err 없이 next를 하게 되면 다음 미들웨어로 가게 된다
  } else {
    res.status(401).send("Only user who does not log in can access it");
  }
};
