import Flows from '../../database/model/object/Flows.js';

const getFlows = async (ctx) => {
  if (!ctx.session.account) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  // 拿取你帳號裡面的所有 Flows
  const flows = new Flows(ctx.session.account);
  try {
    await flows.fetchFlows();
  } catch (err) {
    // 在 Model 階段出現任何錯誤
    ctx.status = 404;
    ctx.body = JSON.stringify(err);
    return;
  }

  // 轉換為物件，不要將一些無用的 Prototype 傳回去
  const previews = new Array(flows.flowPreviews.length);
  flows.flowPreviews.forEach((element) => {
    previews.push({ ...element });
  });

  ctx.status = 200;
  ctx.body = JSON.stringify(previews);
};

export default getFlows;
