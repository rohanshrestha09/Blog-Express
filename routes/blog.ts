import express, { Router } from "express";
const {
  getAllBlogs,
  getBlog,
  postBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
} = require("../controller/blog");

const auth = require("../middleware/auth");

const blogValidator = require("../middleware/blogValidator");

const router: Router = express.Router();

router.use(auth);

router.get("/blog", getAllBlogs);

router.post("/blog", postBlog);

router.get("/blog/:_blogId", blogValidator, getBlog);

router.put("/blog/:_blogId", blogValidator, updateBlog);

router.delete("/blog/:_blogId", blogValidator, deleteBlog);

router.post("/blog/:_blogId/publish", blogValidator, publishBlog);

router.delete("/blog/:_blogId/publish", blogValidator, unpublishBlog);

module.exports = router;
