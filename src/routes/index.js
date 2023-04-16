import Router from 'koa-router';
import users from './user-routes.js';
import swagger from './swagger-routes.js';
// import flowServiceRouter from '../service/flowServices/service.js';

const router = new Router();
const api = new Router().use(users);

router.get('/', async (ctx) => {
    ctx.body = 'ok';
    ctx.status = 200;
    await ctx.session.save();
});

router.get('/hello-world', async (ctx) => {
    ctx.body = 'hello world!';
    ctx.status = 200;
    await ctx.session.save();
});
router.use('/swagger', swagger);
router.use('/api', api.routes());

export default router;
