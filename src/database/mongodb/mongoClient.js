import { MongoClient } from 'mongodb';

const {
    MONGO_NOTEFLOW_USERNAME,
    MONGO_NOTEFLOW_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB,
} = process.env;

console.log(
    'MongoDB init: ' +
        `mongodb://${MONGO_NOTEFLOW_USERNAME}:${MONGO_NOTEFLOW_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`
);

const getMongoClient = () => {
    return new MongoClient(
        `mongodb://${MONGO_NOTEFLOW_USERNAME}:${MONGO_NOTEFLOW_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
        { useUnifiedTopology: true }
    );
};

export { getMongoClient };
