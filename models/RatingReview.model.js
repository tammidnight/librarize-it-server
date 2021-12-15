const { Schema, model } = require("mongoose");
require("./User.model");
require("./Book.model");

const ratingSchema = new Schema(
  {
    ratingValue: Number,
    review: { value: String, created: Date, publicReview: Boolean },
    status: String,
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
