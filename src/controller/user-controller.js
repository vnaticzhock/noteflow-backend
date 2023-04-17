/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import { ValidationError } from 'yup';
import db from '../lib/db.js';
import { generateJWTforUser } from '../lib/utils.js';

export default {
  async getUserToken(ctx) {
    const user = generateJWTforUser(ctx.state.user);

    ctx.body = { user };
  },
  async google_login(ctx) {
    let { user } = ctx.request.body;

    if (!user) {
      ctx.throw(400, "Bad request. You didn't provide user column.");
    }
    const userSelected = await db('users').first().where({ email: user.email });
    // return;

    if (userSelected) {
      // 可以登入
      ctx.status = 200;
      ctx.body = JSON.stringify({ user: _.omit(user, ['password']) });

      ctx.logined = true;
      ctx.email = user.email;
      await ctx.session.save();
      return;
    }

    // 要註冊
    user.uuid = uuidv4();
    user.password = await argon2.hash('google-login-no-password');

    await db('users').insert(
      humps.decamelizeKeys({
        uuid: user.id,
        password: user.password,
        name: `${user.name} ${user.family_name}`,
      }),
    );

    ctx.body = JSON.stringify({ user: _.omit(user, ['password']) });
    ctx.status = 200;

    ctx.logined = true;
    ctx.email = user.email;
    await ctx.session.save();
  },

  async register(ctx) {
    let { user } = ctx.request.body; // if none, assign user with {}

    if (!user) {
      ctx.throw(400, "Bad request. You didn't provide user column.");
    }
    if (!user.email || !user.name || !user.password) {
      ctx.throw(400, "Bad request. You didn't provide sufficient information.");
    }

    user.uuid = uuidv4();
    // const opts = { abortEarly: false, context: { validatePassword: true } };
    // user = await ctx.app.schemas.user.validate(user, opts);

    user.password = await argon2.hash(user.password);

    await db('users').insert(humps.decamelizeKeys(user));

    user = generateJWTforUser(user);

    ctx.status = 200;
    ctx.body = { user: _.omit(user, ['password']) };
  },

  async updateUserInfo(ctx) {
    const { body } = ctx.request;
    const { user: fields = {} } = body;
    const opts = { abortEarly: false, context: { validatePassword: false } };

    if (fields.password) {
      opts.context.validatePassword = true;
    }

    let user = { ...ctx.state.user, ...fields };
    user = await ctx.app.schemas.user.validate(user, opts);

    if (fields.password) {
      user.password = await argon2.hash(user.password);
    }

    user.updatedAt = new Date().toISOString();

    await db('users').where({ id: user.id }).update(humps.decamelizeKeys(user));

    user = generateJWTforUser(user);

    ctx.body = { user: _.omit(user, ['password']) };
    ctx.status = 200;
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

    const isValid = await argon2.verify(user.password, body.user.password);

    ctx.assert(
      isValid,
      401,
      new ValidationError(['is invalid'], '', 'email or password'),
    );

    user = generateJWTforUser(user); // 裡面加入 token

    ctx.status = 200;
    ctx.body = JSON.stringify({ user: _.omit(user, ['password']) }); // 把 password 給挑掉

    ctx.logined = true;
    ctx.email = user.email;
    await ctx.session.save();
  },

  async logout(ctx) {
    // todo
  },
};
