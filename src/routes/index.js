const Router = require("koa-router");
const router = new Router();
const api = new Router();


const users = require("./users-router")
const swagger = require("./swagger-router")

// import flowServiceRouter from '../service/flowServices/service.js';

api.use(users)
api.use(swagger)
api.use(flowServiceRouter)

router.use("/api", api.routes())

module.exports = router;
