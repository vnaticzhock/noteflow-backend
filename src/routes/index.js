import Router from 'koa-router';
import users from './user-routes.js';
import swagger from './swagger-routes.js';
import { redisClient } from '../middleware/redis-session-middleware.js';
// import flowServiceRouter from '../service/flowServices/service.js';

const router = new Router();
const api = new Router().use(users);

router
  .get('/api/hello-world', async (ctx) => {
    // console.log(ctx.session);
    ctx.session.hello = 'hi';
    await ctx.session.save();

    ctx.body = 'hello world!';
    ctx.status = 200;
    // console.log(ctx);
  })
  .get('/api/reset-redis', async (ctx) => {
    await redisClient.flushall();
    const keys = await redisClient.keys('*');
    ctx.status = 200;
  });
router.use('/api/swagger', swagger);
router.use('/api', api.routes());

export default router;
