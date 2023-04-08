/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import session from 'koa-session';
import redisStore from 'koa-redis';
import responseTime from 'koa-response-time';
import xRequestId from 'koa-x-request-id';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import http from 'http';
import cors from 'kcors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import KoaStatic from 'koa-static';
import * as dotenv from 'dotenv';

import WebSocket from 'ws';
import sharedb from './database/sharedb.js';
// import db from 'lib/db.js';
import routes from './routes/index.js';
import error from './middleware/error-middleware.js';
// require("../schemas")(app)

dotenv.config({ path: 'config/.env.development' });

const app = new Koa();
// eslint-disable-next-line object-curly-newline
const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

app.use(responseTime()); // 紀錄後端服務時間
app.use(xRequestId({ inject: true }, app)); // x-request-id
app.use(logger());
app.use(
  cors({
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true,
  }),
);

app.keys = ['session secret...'];
const SESSION_CONFIG = {
  // add redis as session.
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: true,
  store: redisStore({
    url: `redis://${REDIS_ACCOUNT}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
  }),
};
app.use(session(SESSION_CONFIG, app));

app.use(error);
app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());
app.use(KoaStatic('static'));
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

ws.on('connection', (webSocket) => {
  const stream = new WebSocketJSONStream(webSocket);
  sharedb.listen(stream);
});

app.listen(3000);

export default app;
