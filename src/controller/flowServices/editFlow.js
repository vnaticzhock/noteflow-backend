const editFlow = async (ctx) => {
  if (!ctx.session.account) {
    ctx.throw(401, "Unauthorized. You haven't log in yet.");
  }

  const { kinds } = ctx.request.body;

  // 需要:
  // 變動的 flow: flowId
  // 變動了什麼: node or edge
  // 變動的種類：1. remove/ 2. add/ 3. edit attribute

  // TODO
};

export default editFlow;
