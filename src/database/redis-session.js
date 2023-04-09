import redisStore from 'koa-redis';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import session from 'koa-session';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });

const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_SESSION_PORT } =
  process.env;

const redisSession = (app) => {
  console.log('preparing session...');

  const redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_SESSION_PORT,
    password: REDIS_PASSWORD,
    username: REDIS_ACCOUNT,
  });

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
      client: redisClient,
    }),
  };

  return session(SESSION_CONFIG, app);
};

export default redisSession;
