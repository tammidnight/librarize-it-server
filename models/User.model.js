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
    favorites: [String],
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
