import { Router } from 'express';
import auth from '../middleware/auth';
import validateUser from '../middleware/validateUser';
import validatePassword from '../middleware/validatePassword';
import {
  authHandler,
  blogs,
  bookmarks,
  deleteImage,
  deleteProfile,
  follow,
  followers,
  following,
  followingBlogs,
  logout,
  unfollow,
  updateProfile,
} from '../controller/auth';

const router: Router = Router();

router.use(['/auth', '/auth/*'], auth);

router.use(['/auth/:user/follow'], validateUser);

router.get('/auth', authHandler);

router.put('/auth', validatePassword, updateProfile);

router.delete('/auth', validatePassword, deleteProfile);

router.delete('/auth/image', deleteImage);

router.delete('/auth/logout', logout);

router.post('/auth/:user/follow', follow);

router.delete('/auth/:user/follow', unfollow);

router.get('/auth/followers', followers);

router.get('/auth/following', following);

router.get('/auth/blog', blogs);

router.get('/auth/blog/bookmarks', bookmarks);

router.get('/auth/blog/following', followingBlogs);

module.exports = router;
