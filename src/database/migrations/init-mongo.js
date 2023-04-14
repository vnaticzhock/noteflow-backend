/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });

const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
} = process.env;

const mongoClient = new MongoClient(
  `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
);

async function init() {
  await mongoClient.connect();
  const db = mongoClient.db('noteflow');

  db.system.js.save({
    _id: 'createFlow',
    value(owner) {
      const flowId = `${owner}-flow-${uuidv4()}`;
      //
      return flowId;
    },
  });

  await mongoClient.close();
}
