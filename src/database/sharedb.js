/* eslint-disable import/no-extraneous-dependencies */
import ShareDB from 'sharedb';
import richText from 'rich-text';

import RedisPubSub from 'sharedb-redis-pubsub';
import Redis from 'ioredis';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });

// initialize redis client
// eslint-disable-next-line object-curly-newline
const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  username: REDIS_ACCOUNT,
  // enableReadyCheck: false,
});

const redisObserver = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  username: REDIS_ACCOUNT,
  // enableReadyCheck: false,
});

// initialize mongodb client
const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
} = process.env;
const mongoClient = new MongoClient(
  `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
  { useUnifiedTopology: true, maxPoolSize: 10 },
);

ShareDB.types.register(richText); // allow sharedb to colab with rich text format
const sharedb = new ShareDB({
  presence: true,
  doNotForwardSendPresenceErrorsToClient: true,
  pubsub: RedisPubSub({ client: redisClient, observer: redisObserver }),
  db: mongoClient,
});

export default sharedb;
export { mongoClient, redisClient };
