const { Schema, model } = require("mongoose");
require("./User.model");
require("./Book.model");

const librarySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    publicLibrary: Boolean,
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
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

const Library = model("Library", librarySchema);

module.exports = Library;
