const user = require('./user-schema');

export default (app) => {
    // eslint-disable-next-line no-param-reassign
    app.schemas = {
        user,
    };
};
