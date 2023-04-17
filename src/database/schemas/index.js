// const user = require('./user-schema');
import user from './user-schema.js';

const useSchema = (app, next) => {
  // eslint-disable-next-line no-param-reassign
  app.schemas = {
    user,
  };
  next();
};


export default useSchema;