/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import logger from 'koa-logger';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from '@koa/cors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import koaServe from 'koa-serve';
import sharedb from './database/sharedb.js';
import routes from './routes/index.js';
import error from './middleware/error-middleware.js';
import redisSession from './database/redis-session.js';
// import schemas from './database/schemas/index.js';

const app = new Koa();
const server = http.createServer(app.callback());

app.use(
    cors({
        origin: '*',
        exposeHeaders: ['Authorization'],
        credentials: true,
        allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        allowHeaders: ['Authorization', 'Content-Type'],
        keepHeadersOnError: true,
    })
);

app.use(koaBody());
app.use(koaServe({ rootPath: '/', rootDir: 'build' }));
app.use(logger());

//middleware
app.use(error); //error handling
// app.use(schemas);                   //schema handling

//router
app.use(routes.allowedMethods());
app.use(routes.routes());

//redis
app.use(redisSession(app));

//websocket
const ws = new WebSocketServer({ server });
ws.on('connection', (webSocket) => {
    const stream = new WebSocketJSONStream(webSocket);
    sharedb.listen(stream);
});

server.listen(3000);

export default server;
