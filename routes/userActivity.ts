import express, { Router } from "express";

const {
  follow,
  unfollow,
  likeBlog,
  unlikeBlog,
  postComment,
  deleteComment,
} = require("../controller/userActivity");

const auth = require("../middleware/auth");

const userValidator = require("../middleware/userValidator");

const blogValidator = require("../middleware/blogValidator");

const router: Router = express.Router();

router.use(auth);

router.post("/follow/:_queryUserId", userValidator, follow);

router.delete("/follow/:_queryUserId", userValidator, unfollow);

router.post("/blog/:_blogId/like", blogValidator, likeBlog);

router.delete("/blog/:_blogId/like", blogValidator, unlikeBlog);

router.post("/blog/:_blogId/comment", blogValidator, postComment);

router.delete("/blog/:_blogId/comment", blogValidator, deleteComment);

module.exports = router;
