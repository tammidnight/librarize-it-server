const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(500).json({
      errorMessage: "Please enter username, email and password",
    });
    return;
  }
  const myRegex = new RegExp(
    /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  );
  if (!myRegex.test(email)) {
    res.status(500).json({
      errorMessage: "Email format not correct",
    });
    return;
  }
  const myPassRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  );
  if (!myPassRegex.test(password)) {
    res.status(500).json({
      errorMessage:
        "Password needs to have 8 characters, a number and an Uppercase character",
    });
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  User.create({ username, email, password: hash })
    .then((user) => {
      user.password = "***";
      req.session.loggedInUser = user;
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "username or email entered already exists!",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Something went wrong!",
          message: err,
        });
      }
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(500).json({
      error: "Please enter Username and password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      let matchingPw = bcrypt.compareSync(password, user.password);
      if (matchingPw) {
        user.password = "***";
        req.session.loggedInUser = user;
        res.status(200).json(user);
      } else {
        res.status(500).json({
          error: "Passwords don't match",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Username does not exist",
        message: err,
      });
      return;
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).json({});
});

router.get("/user", isLoggedIn, (req, res) => {
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;
