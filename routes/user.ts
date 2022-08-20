import express, { Router } from "express";
const {
  register,
  login,
  getProfile,
  getUserProfile,
  updateProfile,
  deleteProfile,
  deleteProfileImage,
} = require("../controller/user");

const auth = require("../middleware/auth");

const passwordValidator = require("../middleware/passwordValidator");

const router: Router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", auth, getProfile);

router.get("/profile/:_id", auth, getUserProfile);

router.put("/profile/:_id", auth, passwordValidator, updateProfile);

router.delete("/profile/:_id", auth, passwordValidator, deleteProfile);

router.delete("/profile/image/:_id", auth, deleteProfileImage);

module.exports = router;
