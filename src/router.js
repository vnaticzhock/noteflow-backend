import Router from 'koa-router';


import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';
import path from 'path';

const spec = yamljs.load(path.resolve('./swagger.yaml'));

const router = new Router()
  .get('/', async (ctx) => {
    ctx.body = 'hello world!';
    ctx.status = 200;
  })
  .post('/login', async (ctx) => {
    getAccount(ctx);
    
  })
  .post('/logout', async (ctx) => {
    logout(ctx);
  })
  .get('/signup', async (ctx) => {
    signup(ctx);
  })
  .get(
    '/swagger',
    koaSwagger({
      routePrefix: false,
      swaggerOptions: { spec },
    }),
  );
export default router;
