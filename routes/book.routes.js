const router = require("express").Router();
const { default: axios } = require("axios");
const Book = require("../models/Book.model");
const mongoose = require("mongoose");
const Library = require("../models/Library.model");
const User = require("../models/User.model");
const Rating = require("../models/RatingReview.model");

router.post("/add-book", async (req, res) => {
  const { isbn, library } = req.body;
  const _id = req.session.loggedInUser._id;
  const currentUser = mongoose.Types.ObjectId(_id);
  const currentLibrary = mongoose.Types.ObjectId(library);
  let response = null;

  try {
    if (isbn.length === 13) {
      response = await Book.findOneAndUpdate(
        { isbn13: isbn },
        { $addToSet: { user: currentUser, libraries: currentLibrary } },
        { new: true }
      );
      if (response) {
        await Library.findByIdAndUpdate(
          { _id: currentLibrary },
          { $addToSet: { books: response._id } }
        );
      }
    } else if (isbn.length === 10) {
      response = await Book.findOneAndUpdate(
        { isbn10: isbn },
        { $addToSet: { user: currentUser, libraries: currentLibrary } },
        { new: true }
      );
      if (response) {
        await Library.findByIdAndUpdate(
          { _id: currentLibrary },
          { $addToSet: { books: response._id } }
        );
      }
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
        isbn_13,
        isbn_10,
      } = apiRes.data[`ISBN:${isbn}`].details;

      let author = null;

      if (authors) {
        author = authors.map((elem) => {
          return elem.name;
        });
      }

      if (description) {
        description = description.value;
      }

      let isbn13 = null;
      let isbn10 = null;

      if (isbn_13) {
        isbn13 = isbn_13[0];
      }
      if (isbn_10) {
        isbn10 = isbn_10[0];
      }

      let newBook = {
        title,
        author,
        description: description,
        isbn13,
        isbn10,
        pages: number_of_pages,
        published: publish_date,
        image: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
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

router.patch("/book/:id", (req, res) => {
  //TODO
});

router.patch("/library/:libraryId/book/:id/delete", async (req, res) => {
  const userId = req.session.loggedInUser._id;
  const { id, libraryId } = req.params;

  try {
    let update = {};
    let bookResponse = await Book.findById({ _id: id });

    let libraryIds = bookResponse.libraries.map((elem) => {
      return mongoose.Types.ObjectId(elem._id);
    });

    let userResponse = await User.find({ libraries: { $in: libraryIds } });

    if (userResponse[0].libraries.length > 1) {
      update = { libraries: libraryId };
    } else if (userResponse[0].libraries.length === 1) {
      update = { libraries: libraryId, user: userId };
    }

    let book = await Book.findByIdAndUpdate(
      { _id: id },
      { $pull: update },
      { new: true }
    );

    await Library.findByIdAndUpdate(
      { _id: libraryId },
      { $pull: { books: id } }
    );

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

router.get("/book/:id/rating", async (req, res) => {
  const _id = req.session.loggedInUser._id;
  const { id } = req.params;

  try {
    let rating = await Rating.findOne({ $and: [{ user: _id }, { book: id }] });

    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

router.post("/book/:id/rating", async (req, res) => {
  const _id = req.session.loggedInUser._id;
  const { id } = req.params;
  const { ratingValue, review } = req.body;
  let reviewDB = null;
  let rating = null;

  if (review) {
    reviewDB = { value: review, created: new Date() };
  }

  try {
    if (review) {
      rating = await Rating.findOneAndUpdate(
        { $and: [{ user: _id }, { book: id }] },
        { review: reviewDB },
        { new: true, upsert: true }
      );
    }

    if (ratingValue) {
      rating = await Rating.findOneAndUpdate(
        { $and: [{ user: _id }, { book: id }] },
        { ratingValue },
        { new: true, upsert: true }
      );
    }

    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Something went wrong!",
      message: err,
    });
  }
});

module.exports = router;
