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
      type: String,
      required: true,
    },
    description: String,
    status: String,
    isbn: String,
    pages: Number,
    published: Number,
    image: String,
    genre: String,
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
