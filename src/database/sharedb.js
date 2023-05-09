/* eslint-disable import/no-extraneous-dependencies */
import ShareDB from 'sharedb';
import richText from 'rich-text';
import sharedb_mongo from 'sharedb-mongo';

import RedisPubSub from 'sharedb-redis-pubsub';
import Redis from 'ioredis';
import { MongoClient } from 'mongodb';
import json1 from 'ot-json1';

// initialize redis client
// eslint-disable-next-line object-curly-newline
const { REDIS_HOST, REDIS_PORT } = process.env;

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const redisObserver = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

// initialize mongodb client
const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_NOTEFLOW_USERNAME,
  MONGO_NOTEFLOW_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const getMongoClient = () => {
  return new MongoClient(
    `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
    { useUnifiedTopology: true, maxPoolSize: 1 }
  );
};

ShareDB.types.register(json1.type);
ShareDB.types.register(richText.type); // allow sharedb to colab with rich text format
const sharedb = new ShareDB({
  presence: true,
  doNotForwardSendPresenceErrorsToClient: true,
  pubsub: RedisPubSub({ client: redisClient, observer: redisObserver }),
  db: sharedb_mongo(
    `mongodb://${MONGO_NOTEFLOW_USERNAME}:${MONGO_NOTEFLOW_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
    { useUnifiedTopology: true, maxPoolSize: 10, useNewUrlParser: true }
  ),
});

export default sharedb;
export { getMongoClient, redisClient };
