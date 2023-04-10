import { mongoClient } from "../../database/sharedb.js";

const getFlows = async (ctx) => {
    if (!ctx.session.logined || !ctx.session.account) {
        ctx.throw(401, 'No session found.');
      }
    
      await mongoClient.connect();
    
      const noteflow = mongoClient.db('noteflow');
    
      const result = await noteflow.collection('Flows').findOne({
        owner: ctx.session.account,
        flow_id: ctx.session.flow_id,
      }, {flow_name:1});

    
      ctx.body = JSON.stringify(result);
      ctx.status = 200;
}

export default getFlows;