import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please input your fullname."],
    },
    email: {
      type: String,
      required: [true, "Please input your email."],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please input password."],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Please provide Date of Birth."],
    },
    image: String,
    bio: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
