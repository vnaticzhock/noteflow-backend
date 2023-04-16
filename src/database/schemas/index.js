import userSchema from './user-schema.js'; 

export default (ctx, next) => {
    ctx.app.schemas = {
        userSchema,
    };
    return next();
};
