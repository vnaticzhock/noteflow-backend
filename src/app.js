/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import session from 'koa-session';
import * as dotenv from 'dotenv';

import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import sharedb from './database/sharedb.js';
import routes from './routes/index.js';
// const routes = require("../routes")

require("../schemas")(app)

const responseTime = require("koa-response-time")
const helmet = require("koa-helmet")
const logger = require("koa-logger")
const error = require("../middleware/error-middleware")

dotenv.config();

const app = new Koa();
app.use(responseTime())
app.use(xRequestId({ inject: true }, app))
app.use(logger())
app.use(helmet())
app.use(
  cors({
    origin: "*",
    exposeHeaders: ["Authorization"],
    credentials: true,
    allowMethods: ["GET", "PUT", "POST", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"],
    keepHeadersOnError: true,
  }),
)
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

app.use(error)
app.use(session(SESSION_CONFIG, app));
app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());

// const server = http.createServer(app);
// const wss = new WebSocketServer({ port: 8091});

// wss.on('error', console.error);
// wss.on('connection', (webSocket) => {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message)
//   });
//   const stream = new WebSocketJSONStream(webSocket);
//   sharedb.listen(stream);
// });

app.listen(3000);

export default app;
