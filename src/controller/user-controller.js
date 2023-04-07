import humps from 'humps';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import pkg from 'bcrypt';
import { ValidationError } from '../lib/errors.js';
import db from '../lib/db.js';

export default {
  async get(ctx) {
    // const user = generateJWTforUser(ctx.state.user);

    ctx.body = { user };
  },

  async post(ctx) {
    const { body } = ctx.request;
    let { user = {} } = body;
    const opts = { abortEarly: false, context: { validatePassword: true } };

    user.id = uuidv4();

    user = await ctx.app.schemas.user.validate(user, opts);
    
    user.password = await pkg.hash(user.password, 10);

    await db('users').insert(humps.decamelizeKeys(user));

    user = generateJWTforUser(user);

    ctx.body = { user: _.omit(user, ['password']) };
  },

  async put(ctx) {
    const { body } = ctx.request;
    let { user: fields = {} } = body;
    const opts = { abortEarly: false, context: { validatePassword: false } };

    if (fields.password) {
      opts.context.validatePassword = true;
    }

    let user = Object.assign({}, ctx.state.user, fields);
    user = await ctx.app.schemas.user.validate(user, opts);

    if (fields.password) {
      user.password = await pkg.hash(user.password, 10);
    }

    user.updatedAt = new Date().toISOString();

    await db('users').where({ id: user.id }).update(humps.decamelizeKeys(user));

    // user = generateJWTforUser(user);

    ctx.body = { user: _.omit(user, ['password']) };
  },

  async login(ctx) {
    const { body } = ctx.request;

    ctx.assert(
      _.isObject(body.user) && body.user.email && body.user.password,
      422,
      new ValidationError(['malformed request'], '', 'email or password'),
    );

    let user = await db('users').first().where({ email: body.user.email });

    ctx.assert(
      user,
      401,
      new ValidationError(['is invalid'], '', 'email or password'),
    );

    const isValid = await pkg.compare(body.user.password, user.password);

    ctx.assert(
      isValid,
      401,
      new ValidationError(['is invalid'], '', 'email or password'),
    );

    // user = generateJWTforUser(user);

    ctx.body = { user: _.omit(user, ['password']) };
  },
};
