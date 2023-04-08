/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';

import logger from 'koa-logger';
import http from 'http';
import { WebSocketServer } from 'ws';

import cors from 'kcors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import koaServe from 'koa-serve';

import sharedb from './database/sharedb.js';
import routes from './routes/index.js';
import error from './middleware/error-middleware.js';
import redisSession from './database/redis-session.js';

const app = new Koa();

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

app.use(redisSession(app));
app.use(error);
app.use(koaBody());
app.use(routes.allowedMethods());
app.use(routes.routes());

app.use(koaServe({ rootPath: '/', rootDir: 'build' }));

const server = http.createServer(app);
const ws = new WebSocketServer({ server });

ws.on('connection', (webSocket) => {
  const stream = new WebSocketJSONStream(webSocket);
  sharedb.listen(stream);
});

server.listen(3000);

export default app;
