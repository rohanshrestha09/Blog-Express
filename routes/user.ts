import { Router } from 'express';
import validateUser from '../middleware/validateUser';
import { login, register, suggestions, user } from '../controller/user';
import { blog } from '../controller/user/blog';
import { followers, following } from '../controller/user/followers';

const router: Router = Router();

router.get('/user/suggestions', suggestions);

router.post('/register', register);

router.post('/login', login);

router.use(['/user/*'], validateUser);

router.get('/user/:user', user);

router.get('/user/:user/blog', blog);

router.get('/user/:user/followers', followers);

router.get('/user/:user/following', following);

module.exports = router;
