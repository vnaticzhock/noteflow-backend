import Flow from '../../database/model/object/Flow.js';

const createFlow = async (ctx) => {
  if (!ctx.session.account) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  const owner = ctx.session.account;
  const flowId = await Flow.generateFlowId(owner);
  const flow = new Flow(flowId, '', owner);

  try {
    await flow.storeFlow();
  } catch (err) {
    ctx.throw(401, err);
  }

  ctx.body = flowId;
  ctx.status = 200;
};

export default createFlow;
