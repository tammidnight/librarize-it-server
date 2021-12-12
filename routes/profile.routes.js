const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const Library = require("../models/Library.model");
const mongoose = require("mongoose");
const { validateEditInput } = require("../utilities/validators");
const Book = require("../models/Book.model");

router.get("/profile/:id", (req, res) => {
  const _id = req.session.loggedInUser._id;

  User.findById({ _id })
    .populate("libraries")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.patch("/profile/:id", async (req, res) => {
  const _id = req.session.loggedInUser._id;
  let { username, email, password, newPassword, image, favorites } = req.body;

  try {
    let response = await User.findById({ _id });
    let matchingPW = bcrypt.compareSync(password, response.password);

    if (!matchingPW) {
      res.status(400).json({
        errorMessage: "Please enter your current password!",
      });
    } else {
      if (username === "") {
        username = response.username;
      }
      if (email === "") {
        email = response.email;
      }
      if (newPassword === "") {
        newPassword = password;
      }

      const { notValid, errors } = validateEditInput(
        username,
        email,
        password,
        newPassword
      );

      if (notValid) {
        res.status(400).json(errors);
        return;
      }

      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(newPassword, salt);

      let user = await User.findByIdAndUpdate(
        { _id },
        { username, email, password: hash, image, favorites },
        { new: true, runValidators: true }
      );
      user.password = "***";
      req.session.loggedInUser = user;
      res.status(200).json(user);
    }
  } catch (err) {
    let error = {};

    if (err.code === 11000) {
      if (Object.keys(err.keyValue)[0] === "username") {
        error[
          Object.keys(err.keyValue)[0]
        ] = `Username ${err.keyValue.username} already exists!`;
        error.message = err;
      } else {
        error[
          Object.keys(err.keyValue)[0]
        ] = `E-Mail ${err.keyValue.email} already exists!`;
        error.message = err;
      }
      res.status(400).json(error);
    } else {
      res.status(500).json({
        errorMessage: "Something went wrong!",
        message: err,
      });
    }
  }
});

router.delete("/profile/:id/delete", async (req, res) => {
  const _id = req.session.loggedInUser._id;

  try {
    let response = await Library.find({ user: mongoose.Types.ObjectId(_id) });
    let libraryIds = response.map((elem) => {
      return mongoose.Types.ObjectId(elem._id);
    });
    await Book.updateMany(
      { user: _id },
      { $pull: { user: _id, libraries: { $in: libraryIds } } }
    );
    await User.findByIdAndDelete({ _id });
    await Library.deleteMany({ user: mongoose.Types.ObjectId(_id) });

    req.session.destroy();
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

router.patch("/favorites", async (req, res) => {
  const _id = req.session.loggedInUser._id;
  let { newFavorite, label } = req.body;

  try {
    let user = null;
    if (newFavorite) {
      user = await User.findByIdAndUpdate(
        { _id },
        { $addToSet: { favorites: newFavorite } },
        { new: true }
      );
    } else if (label) {
      user = await User.findByIdAndUpdate(
        { _id },
        { $pull: { favorites: label } },
        { new: true }
      );
    }
    user.password = "***";
    req.session.loggedInUser = user;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

module.exports = router;
