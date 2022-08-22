import express, { Router } from "express";

const { resetPassword, resetLink } = require("../controller/resetPassword");

const userValidator = require("../middleware/userValidator");

const router: Router = express.Router();

router.get("/reset-password", resetLink);

router.post(
  "/reset-password/:_queryUserId/:token",
  userValidator,
  resetPassword
);

module.exports = router;
