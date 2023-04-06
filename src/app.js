/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import session from 'koa-session';
import * as dotenv from 'dotenv';

import WebSocket from 'ws';
import http from 'http';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import sharedb from './sharedb.js';
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

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', (webSocket) => {
  const stream = new WebSocketJSONStream(webSocket);
  sharedb.listen(stream);
});

app.listen(7000);

export default app;
