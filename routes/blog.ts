import { Router } from 'express';
import {
  blog,
  blogs,
  comment,
  deleteBlog,
  genre,
  like,
  postBlog,
  publish,
  suggestions,
  uncomment,
  unlike,
  unpublish,
  updateBlog,
} from '../controller/blog';
import auth from '../middleware/auth';
import validateBlog from '../middleware/validateBlog';

const router: Router = Router();

router.get('/blog', blogs);

router.get('/blog/suggestions', suggestions);

router.get('/blog/genre', genre);

router.use(['/blog/:blog', '/blog/:blog/*'], validateBlog);

router.get('/blog/:blog', blog);

router.use(['/blog', '/blog/*'], auth);

router.post('/blog', postBlog);

router.put('/blog/:blog', updateBlog);

router.delete('/blog/:blog', deleteBlog);

router.post('/blog/:blog/publish', publish);

router.delete('/blog/:blog/publish', unpublish);

router.post('/blog/:blog/like', like);

router.delete('/blog/:blog/like', unlike);

router.post('/blog/:blog/comment', comment);

router.delete('/blog/:blog/comment', uncomment);

module.exports = router;
