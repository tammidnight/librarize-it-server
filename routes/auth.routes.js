const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const {
  validateSignUpInput,
  validateLoginInput,
} = require("../utilities/validators");

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
  const { username, email, password, confirmPassword } = req.body;

  const { notValid, errors } = validateSignUpInput(
    username,
    email,
    password,
    confirmPassword
  );

  if (notValid) {
    res.status(400).json(errors);
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  User.create({ username, email, password: hash, image: "", grid: true })
    .then((user) => {
      user.password = "***";
      req.session.loggedInUser = user;
      res.status(200).json(user);
    })
    .catch((err) => {
      let error = {};

      if (err.code === 11000) {
        if (Object.keys(err.keyValue)[0] === "username") {
          error[
            Object.keys(err.keyValue)[0]
          ] = `Username ${err.keyValue.username} already exists!`;
          error.username = err;
        } else {
          error[
            Object.keys(err.keyValue)[0]
          ] = `E-Mail ${err.keyValue.email} already exists!`;
          error.email = err;
        }
        res.status(400).json(error);
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

  const { notValid, errors } = validateLoginInput(username, password);

  if (notValid) {
    res.status(400).json(errors);
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
        res.status(400).json({
          error: "Passwords don't match",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
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
