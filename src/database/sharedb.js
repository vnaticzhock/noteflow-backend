// /* eslint-disable import/no-extraneous-dependencies */
// import ShareDB from 'sharedb';
// import richText from 'rich-text';

// import RedisPubSub from 'sharedb-redis-pubsub';
// import { createClient } from 'redis';
// import { MongoClient } from 'mongodb';
// import * as dotenv from 'dotenv';

// dotenv.config();

// // initialize redis client
// // eslint-disable-next-line object-curly-newline
// const { REDIS_ACCOUNT, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

// const redisClient = createClient({
//   url: `redis://${REDIS_ACCOUNT}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
// });

// // initialize mongodb client
// const {
//   MONGO_INITDB_ROOT_USERNAME,
//   MONGO_INITDB_ROOT_PASSWORD,
//   MONGO_HOST,
//   MONGO_PORT,
// } = process.env;
// const mongoClient = new MongoClient(
//   `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
// );

// ShareDB.types.register(richText); // allow sharedb to colab with rich text format
// const sharedb = new ShareDB({
//   presence: true,
//   doNotForwardSendPresenceErrorsToClient: true,
//   pubsub: RedisPubSub({ client: redisClient }),
//   db: mongoClient,
// });

// export default sharedb;
// export { mongoClient };
