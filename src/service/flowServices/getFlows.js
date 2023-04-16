import { mongoClient } from '../../database/sharedb.js';

const getFlows = async () => {
    await mongoClient.connect();

    // mongoClient.
};

export default getFlows;
