const router = require("express").Router();
const { default: axios } = require("axios");
const Book = require("../models/Book.model");
const mongoose = require("mongoose");
const Library = require("../models/Library.model");

router.post("/add-book", async (req, res) => {
  const { isbn, library } = req.body;
  const _id = req.session.loggedInUser._id;
  const currentUser = mongoose.Types.ObjectId(_id);
  const currentLibrary = mongoose.Types.ObjectId(library);
  let response = null;

  try {
    if (isbn.length === 13) {
      response = await Book.findOneAndUpdate(
        { isbn_13: isbn },
        { $addToSet: { user: currentUser, libraries: currentLibrary } },
        { new: true }
      );
    } else if (isbn.length === 10) {
      response = await Book.findOneAndUpdate(
        { isbn_10: isbn },
        { $addToSet: { user: currentUser, libraries: currentLibrary } },
        { new: true }
      );
    }

    if (!response) {
      let apiRes = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
      );

      let {
        title,
        authors,
        description,
        number_of_pages,
        publish_date,
        subjects,
        isbn_13,
        isbn_10,
      } = apiRes.data[`ISBN:${isbn}`].details;

      let author = authors.map((elem) => {
        return elem.name;
      });

      let newBook = {
        title,
        author,
        description,
        isbn_13: isbn_13[0],
        isbn_10: isbn_10[0],
        pages: number_of_pages,
        published: publish_date,
        image: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
        genre: subjects,
        libraries: [currentLibrary],
        user: [currentUser],
      };

      let book = await Book.create(newBook);
      await Library.findByIdAndUpdate(
        { _id: currentLibrary },
        { $addToSet: { books: book._id } }
      );
      res.status(200).json(book);
    } else {
      res.status(200).json(response);
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

router.get("/book/:id", (req, res) => {
  const { id: _id } = req.params;

  Book.findById({ _id })
    .populate("libraries")
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong!",
        message: err,
      });
    });
});

router.patch("/book/:id", (req, res) => {});

router.delete("/book/:id/delete", (req, res) => {});

module.exports = router;
