const logout = async (ctx) => {
  ctx.session = null;
  ctx.status = 200;
  ctx.body = 'Log out successfully!';
};

export default logout;
