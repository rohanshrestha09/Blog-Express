import { Router } from 'express';
import { blog, blogs, suggestions, postBlog, updateBlog, deleteBlog } from '../controller/blog';
import { genre } from '../controller/blog/genre';
import { publish, unpublish } from '../controller/blog/publish';
import { likes, like, unlike } from '../controller/blog/like';
import { comments, comment, uncomment } from '../controller/blog/comment';
import auth from '../middleware/auth';
import validateBlog from '../middleware/validateBlog';

const router: Router = Router();

router.get('/blog', blogs);

router.get('/blog/suggestions', suggestions);

router.get('/blog/genre', genre);

router.use(['/blog/:blog', '/blog/:blog/*'], validateBlog);

router.get('/blog/:blog', blog);

router.get('/blog/:blog/like', likes);

router.get('/blog/:blog/comment', comments);

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
