import express, { Router } from 'express';
const {
  getAllBlogs,
  getCategorisedBlog,
  getBlog,
  getGenre,
  postBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
} = require('../controller/blog');

const auth = require('../middleware/auth');

const blogValidator = require('../middleware/blogValidator');

const router: Router = express.Router();

router.get('/blog', getAllBlogs);

router.get('/blog/categorised', getCategorisedBlog);

router.get('/blog/getGenre', getGenre);

router.use(['/blog/:_blogId', '/blog/:_blogId/publish'], auth, blogValidator);

router.post('/blog', auth, postBlog);

router.get('/blog/:_blogId', getBlog);

router.put('/blog/:_blogId', updateBlog);

router.delete('/blog/:_blogId', deleteBlog);

router.post('/blog/:_blogId/publish', publishBlog);

router.delete('/blog/:_blogId/publish', unpublishBlog);

module.exports = router;
