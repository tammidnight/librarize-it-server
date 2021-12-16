const { Schema, model } = require("mongoose");
require("./Library.model");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    favorites: [
      {
        type: String,
        enum: [
          "Action and adventure",
          "Alternate history",
          "Anthology",
          "Art/architecture",
          "Autobiography",
          "Biography",
          "Business/economics",
          "Children's",
          "Classic",
          "Comic book",
          "Coming-of-age",
          "Crime",
          "Crafts/hobbies",
          "Cookbook",
          "Dictionary",
          "Drama",
          "Encyclopedia",
          "Fairytale",
          "Fantasy",
          "Graphic novel",
          "Guide",
          "Historical fiction",
          "Horror",
          "Health/fitness",
          "History",
          "Home and garden",
          "Humor",
          "Journal",
          "Math",
          "Memoir",
          "Mystery",
          "Paranormal romance",
          "Picture book",
          "Poetry",
          "Political thriller",
          "Philosophy",
          "Prayer",
          "Religion, spirituality, and new age",
          "Romance",
          "Review",
          "Satire",
          "Science fiction",
          "Short story",
          "Suspense",
          "Science",
          "Self help",
          "Sports and leisure",
          "Textbook",
          "True crime",
          "Travel",
          "Thriller",
          "Western",
          "Young adult",
        ],
      },
    ],
    grid: Boolean,
    libraries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Library",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
