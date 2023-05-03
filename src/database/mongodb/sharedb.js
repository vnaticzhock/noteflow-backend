/* eslint-disable import/no-extraneous-dependencies */
import ShareDB from 'sharedb';
import richText from 'rich-text';
import sharedb_mongo from 'sharedb-mongo';
import RedisPubSub from 'sharedb-redis-pubsub';
import * as dotenv from 'dotenv';
import redisClient from '../redis/redisClient.js';
import redisObserver from '../redis/redisObserver.js';
import { getMongoClient } from './mongoClient.js';
import json1 from 'ot-json1';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_EXPRESS_HOST, MONGO_PORT } = process.env;

ShareDB.types.register(json1.type);
ShareDB.types.register(richText.type); // allow sharedb to colab with rich text format
const sharedb = new ShareDB({
    presence: true,
    doNotForwardSendPresenceErrorsToClient: true,
    pubsub: RedisPubSub({ client: redisClient, observer: redisObserver }),
    db: sharedb_mongo(
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_EXPRESS_HOST}:${MONGO_PORT}/noteflow`,
        { useUnifiedTopology: true, maxPoolSize: 10, useNewUrlParser: true }
    ),
});

export default sharedb;
