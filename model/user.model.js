const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Backend");
const jwt = require("jsonwebtoken");
const secret = "This is just for testing";
const refreshTokenSecret = "This is also for testing";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//     },
//     secret,
//     {
//       expiresIn: "10D",
//     }
//   );
// };
// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       id: this._id,
//     },
//     refreshTokenSecret,
//     {
//       expiresIn: "10D",
//     }
//   );
// };

module.exports = mongoose.model("userModel", userSchema);
