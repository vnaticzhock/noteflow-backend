import { MongoClient } from 'mongodb';

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } =
    process.env;

console.log(
    'MongoDB init: ' +
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`
);

const getMongoClient = () => {
    return new MongoClient(
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
        { useUnifiedTopology: true }
    );
};

export { getMongoClient };
