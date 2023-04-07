import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';
import path from 'path';
const spec = yamljs.load(path.resolve('../../swagger.yaml'));

const Router = require('koa-router');
const router = new Router();

router.get(
  '/swagger',
  koaSwagger({
    routePrefix: false,
    swaggerOptions: { spec },
  }),
);

export default router.routes();
