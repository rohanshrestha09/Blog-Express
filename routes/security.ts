import express, { Router } from "express";

const {
  resetPassword,
  resetLink,
  changePassword,
} = require("../controller/security");

const userValidator = require("../middleware/userValidator");

const auth = require("../middleware/auth");

const passwordValidator = require("../middleware/passwordValidator");

const router: Router = express.Router();

router.get("/security/reset-password", resetLink);

router.post(
  "/security/reset-password/:_queryUserId/:token",
  userValidator,
  resetPassword
);

router.post(
  "/security/change-password",
  auth,
  passwordValidator,
  changePassword
);

module.exports = router;
