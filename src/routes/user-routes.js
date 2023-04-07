import Router from 'koa-router';
// import ctrl from '../controllers';
import userController from '../controller/user-controller.js';
import auth from '../middleware/auth-required-middleware.js';
const router = new Router()

// const auth = require("../middleware/auth-required-middleware")

router.post("/users/login", userController.login)
router.post("/users", userController.post)

router.get("/user", auth, userController.get)
router.put("/user", auth, userController.put)

export default router.routes();