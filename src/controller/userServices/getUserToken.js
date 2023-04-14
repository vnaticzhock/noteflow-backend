import { generateJWTforUser } from '../../lib/utils.js';

const getUserToken = async (ctx) => {
  // TODO: anything to do with session?
  const user = generateJWTforUser(ctx.state.user);

  ctx.body = { user };
  ctx.status = 200;
};

export default getUserToken;
