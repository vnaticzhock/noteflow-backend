import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });
const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_NOTEFLOW_USERNAME,
  MONGO_NOTEFLOW_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
} = process.env;

console.log("MongoDB init: " + MONGO_NOTEFLOW_USERNAME, MONGO_NOTEFLOW_PASSWORD)

const getMongoClient = () => {
  return new MongoClient(
    `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
    { useUnifiedTopology: true, maxPoolSize: 1 },
  );
};

export { getMongoClient };
