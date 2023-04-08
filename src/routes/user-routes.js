import Router from 'koa-router';
// import ctrl from '../controllers';
import userController from '../controller/user-controller.js';
import { auth } from '../middleware/auth-required-middleware.js';

const router = new Router();

router.get('/user/login', userController.loginPage);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);
router.post('/user/register', userController.register);

router.get('/user', auth, userController.getUserToken);
router.put('/user', auth, userController.updateUserInfo);

export default router.routes();
