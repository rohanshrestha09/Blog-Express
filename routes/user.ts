import express, { Router } from "express";
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
  deleteProfileImage,
} = require("../controller/user");
const auth = require("../middleware/auth");

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile/:_id", auth, updateProfile);
router.delete("/profile/:_id", auth, deleteProfile);
router.delete("/profile/image/:_id", auth, deleteProfileImage);

module.exports = router;
