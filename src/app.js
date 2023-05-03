/* eslint-disable import/no-extraneous-dependencies */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import logger from 'koa-logger';
import { WebSocketServer } from 'ws';
import http from 'http';
import koaSslify from 'koa-sslify';
import cors from '@koa/cors';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import koaServe from 'koa-serve';
import sharedb from './database/mongodb/sharedb.js';
import routes from './routes/index.js';
import error from './middleware/error-middleware.js';
import redisSession, { getSession } from './database/redis/redisSession.js';

const app = new Koa();
// const server = http.createServer(app.callback());

// const {default: sslify} = koaSslify;
// app.use(sslify())

app.use(logger());
app.use(
    cors({
        origin: '*',
        exposeHeaders: ['Authorization'],
        credentials: true,
        allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Authorization', 'Content-Type'],
        exposeHeaders: [
            'set-cookie',
            'access-control-allow-origin',
            'access-control-allow-credentials',
        ],
        keepHeadersOnError: true,
    })
);

app.use(redisSession(app));

app.use(koaBody());
app.use(koaServe({ rootPath: '/', rootDir: 'build' }));
app.use(logger());

// middleware
app.use(error); // error handling

// router
app.use(routes.allowedMethods());

const server = http.createServer(
    // {
    //   key: fs.readFileSync('./config/cert/server.key'),
    //   cert: fs.readFileSync('./config/cert/server.cert')
    // },
    app.callback()
);

const wsServer = new WebSocketServer({ server });

app.use(async (ctx, next) => {
    if (server instanceof http.Server) {
        const { user } = ctx.request.body;
        ctx.session = user ? { ...user } : ctx.session;
    }
    await next();
});

app.use(routes.routes());
app.use(koaServe({ rootPath: '/', rootDir: 'build' }));

wsServer.on('connection', (ws, req) => {
    // 某一個特定的人進來了這個地方，ws 裡面應該會存放有這個用戶的 sid & cookie
    // getSession(req.headers.cookie).then((mapper) => {
    //   const email = mapper.email;
    //   if(req.url === 'flow?id=.....') {
    //     // get id
    //     const id = ""
    //     Flow.CanUserEdit(id, id.split('-')[0], email)
    //   } else if(req.url === 'node?id=....') {
    //     const id = ""
    //     if(!Node.CanUserEdit(id, id.split('-')[0], email)) {
    //       ws.send(Buffer.from('Enter read only mode.'))
    //     }
    //   }
    // }).catch((e) => ws.close(401, 'Unauthorized.'))
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
});

server.listen(3000);

export default server;
