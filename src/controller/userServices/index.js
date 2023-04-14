import getUserToken from './getUserToken.js';
import googleLogin from './googleLogin.js';
import login from './login.js';
import logout from './logout.js';
import register from './register.js';
import updateUserInfo from './updateUserInfo.js';

const service = {
  getUserToken,
  googleLogin,
  login,
  logout,
  register,
  updateUserInfo,
};

export default service;
