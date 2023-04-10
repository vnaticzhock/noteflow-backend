import { mongoClient } from '../sharedb.js';

const getLibrary = async (ctx) => {
    if (!ctx.session.logined || !ctx.session.account) {
        ctx.throw(401, 'No session found.');
    }

    await mongoClient.connect();

    const noteflow = mongoClient.db('noteflow');

    const result = await noteflow.collection('library').findOne({
        user_id: ctx.session.account,
    });

    ctx.body = JSON.stringify(result);
    ctx.status = 200;
};

export default getLibrary;
