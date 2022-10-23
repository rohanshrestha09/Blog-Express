import { Router } from 'express';
import validateUser from '../middleware/validateUser';
import { blog, followers, following, login, register, suggestions, user } from '../controller/user';

const router: Router = Router();

router.get('/user/suggestions', suggestions);

router.use(['/user/*'], validateUser);

router.post('/register', register);

router.post('/login', login);

router.get('/user/:user', user);

router.get('/user/:user/blog', blog);

router.get('/user/:user/followers', followers);

router.get('/user/:user/following', following);

module.exports = router;
