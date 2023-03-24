import Koa from 'koa';
import { koaBody } from 'koa-body';
import session from 'koa-session';
import * as dotenv from 'dotenv';

import router from './router.js';

dotenv.config();

const app = new Koa();

app.keys = ['session secret...'];
const SESSION_CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: true,
};
app.use(session(SESSION_CONFIG, app));

app.use(koaBody());
app.use(router.routes());

app.listen(9999);

export default app;
