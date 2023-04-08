import Router from 'koa-router';
import users from './user-routes.js';
import swagger from './swagger-routes.js';
// import flowServiceRouter from '../service/flowServices/service.js';

const router = new Router();
const api = new Router();

api.use(users)
api.use(swagger)
// api.use(flowServiceRouter)

router.use("/api", api.routes())

export default router;
