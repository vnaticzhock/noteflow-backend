import Router from 'koa-router';
// import ctrl from '../controllers';
import { user, service } from '../controller/index.js';
import { auth } from '../middleware/auth-required-middleware.js';

const router = new Router();
router
  .post('/user/login', user.login)
  .post('/user/logout', user.logout)
  .post('/user/register', user.register)

  .get('/get-flows', service.getFlows)
  .get('/get-flow', service.getFlow)
  .get('/get-library', service.getLibrary)

  .get('/user', auth, user.getUserToken)
  .put('/user', auth, user.updateUserInfo);

export default router.routes();
