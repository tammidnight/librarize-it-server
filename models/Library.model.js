const { Schema, model } = require("mongoose");
import "./User.model";
import "./Book.model";

const librarySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    publicLibrary: boolean,
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
