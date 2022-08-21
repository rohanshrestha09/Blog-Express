import express, { Router } from "express";
const {
  getAllBlogs,
  getBlog,
  postBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");

const auth = require("../middleware/auth");

const router: Router = express.Router();

router.use(auth);

router.get("/blog", getAllBlogs);

router.get("/blog/:_blogId", getBlog);

router.post("/blog/:_authorId", postBlog);

router.put("/blog/:_blogId", updateBlog);

router.delete("/blog/:_blogId", deleteBlog);

module.exports = router;
