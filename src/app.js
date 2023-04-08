/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import session from 'koa-session';
import redisStore from 'koa-redis';
import * as dotenv from 'dotenv';

import WebSocket from 'ws';
import http from 'http';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import sharedb from './sharedb.js';
// eslint-disable-next-line import/no-named-as-default
import router from './router.js';

dotenv.config();

const app = new Koa();

// eslint-disable-next-line object-curly-newline
const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

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
};
app.use(
  session(
    {
      ...SESSION_CONFIG,
      store: redisStore({
        url: `redis://${REDIS_ACCOUNT}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
      }),
    },
    app,
  ),
);

app.use(koaBody());
app.use(router.routes());

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', (webSocket) => {
  const stream = new WebSocketJSONStream(webSocket);
  sharedb.listen(stream);
});

app.listen(7000);

export default app;
