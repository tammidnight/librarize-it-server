const router = require("express").Router();
const User = require("../models/User.model");

router.get("/profile/:id", (req, res) => {
  let myUserInfo = req.session.loggedInUser;
  let _id = myUserInfo._id;

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

module.exports = router;
