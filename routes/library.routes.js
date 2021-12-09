const router = require("express").Router();
const Library = require("../models/Library.model");
const User = require("../models/User.model");

router.post("/create-library", async (req, res) => {
  const { title, description, publicLibrary } = req.body;
  const _id = req.session.loggedInUser._id;

  if (!title) {
    res.status(400).json({
      errorMessage: "Please enter a title",
    });
    return;
  }
  try {
    let library = await Library.create({
      title,
      description,
      publicLibrary,
      user: _id,
    });
    await User.findByIdAndUpdate(
      { _id },
      { $addToSet: { libraries: library._id } }
    );
    res.status(200).json(library);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

router.get("/library/:id", (req, res) => {
  const { id: _id } = req.params;

  Library.findById({ _id })
    .populate("books")
    .then((library) => {
      res.status(200).json(library);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong!",
        message: err,
      });
    });
});

router.patch("/library/:id", (req, res) => {
  const { id: _id } = req.params;
  const { title, description, publicLibrary } = req.body;

  if (!title) {
    res.status(400).json({
      errorMessage: "Please enter a title",
    });
    return;
  }

  Library.findByIdAndUpdate({ _id }, { title, description, publicLibrary })
    .then((library) => {
      res.status(200).json(library);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong!",
        message: err,
      });
    });
});

router.delete("/library/:id/delete", (req, res) => {});

module.exports = router;
