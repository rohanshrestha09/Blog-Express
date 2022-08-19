import express, { Router } from "express";
const {
  register,
  login,
  profile,
  updateProfile,
} = require("../controller/user");
const auth = require("../middleware/auth");

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);
router.put("/profile/:_id", auth, updateProfile);

module.exports = router;
