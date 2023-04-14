import Flows from '../../database/model/object/Flows.js';

const getFlow = async (ctx) => {
  if (!ctx.session.account) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  const { flowId } = ctx.request.body;
  let flow;

  try {
    flow = await Flows.fetchFlow(flowId);
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.status = 404;
    ctx.body = JSON.stringify(err);
    return;
  }

  // 如果不是 owner 就無法存取
  // TODO: 共編的時候需要把這個條件放寬
  if (ctx.session.account !== flow.owner) {
    ctx.status = 404;
  }

  // 順利地拿到 Flow 的內容
  ctx.status = 200;
  ctx.body = JSON.stringify(flow);
};

export default getFlow;
