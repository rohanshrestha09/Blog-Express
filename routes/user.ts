import express, { Router } from "express";
const {
  register,
  login,
  getProfile,
  authSuccess,
  updateProfile,
  deleteProfile,
  deleteProfileImage,
} = require("../controller/user");

const auth = require("../middleware/auth");

const passwordValidator = require("../middleware/passwordValidator");

const userValidator = require("../middleware/userValidator");

const router: Router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.use(auth);

router.get("/auth", authSuccess);

router.get("/profile/:_queryUserId", userValidator, getProfile);

router.put("/profile", passwordValidator, updateProfile);

router.delete("/profile", passwordValidator, deleteProfile);

router.delete("/profile/image", deleteProfileImage);

module.exports = router;
