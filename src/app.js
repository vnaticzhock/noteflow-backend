/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import session from 'koa-session';
import dotenv from 'dotenv';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
// import db from 'lib/db.js';
import routes from './routes/index.js';


// require("../schemas")(app)
import responseTime from 'koa-response-time';
import xRequestId from 'koa-x-request-id';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import cors from 'kcors';
import error from './middleware/error-middleware.js';

const BASE_PATH = `${process.cwd()}`;
dotenv.config({path: "config/.env.development"});

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
