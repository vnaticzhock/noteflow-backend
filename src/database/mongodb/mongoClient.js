import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/config/.env.development` });
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_EXPRESS_HOST, MONGO_PORT, MONGO_DB } = process.env;

console.log(
    'MongoDB init: ' +
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_EXPRESS_HOST}:${MONGO_PORT}`
);

const getMongoClient = () => {
    return new MongoClient(
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_EXPRESS_HOST}:${MONGO_PORT}/${MONGO_DB}`,
        { useUnifiedTopology: true }
    );
};

export { getMongoClient };
