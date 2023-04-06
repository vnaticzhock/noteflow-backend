import Router from 'koa-router';
import argon2 from 'argon2';
import postgre from './database.js';

import flowServiceRouter from './flowServices/service.js'

const router = new Router()
  .get('/', async (ctx) => {
    ctx.body = 'hello world!';
    ctx.status = 200;
  })
  .post('/login', async (ctx) => {
    const { account, password } = ctx.request.body;

    if (!account || !password) {
      ctx.throw(401, 'Data is missing.');
    }

    const { rows } = await postgre.query(
      'SELECT * FROM users WHERE account = $1',
      [account],
    );

    if (rows.length === 0) {
      ctx.throw(401, `Unauthorized. User ${account} not found.`);
    }

    if (!(await argon2.verify(rows[0].password, password))) {
      ctx.throw(401, 'Unauthorized. Password error');
    }

    ctx.session.logined = true;
    ctx.status = 200;
  })
  .use('/service', flowServiceRouter.routes());

export default router;
