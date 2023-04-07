const user = require('./user-schema');

export default function (app) {
    app.schemas = {
      user
    };
}
