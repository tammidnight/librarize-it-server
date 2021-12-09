const { Schema, model } = require("mongoose");
require("./User.model");
require("./Library.model");

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Array,
      required: true,
    },
    description: String,
    status: String,
    isbn_13: {
      type: String,
      unique: true,
    },
    isbn_10: {
      type: String,
      unique: true,
    },
    pages: Number,
    published: String,
    image: String,
    genre: Array,
    libraries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Library",
      },
    ],
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Book = model("Book", bookSchema);

module.exports = Book;
