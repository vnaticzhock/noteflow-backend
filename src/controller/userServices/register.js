/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';

const register = async (ctx) => {
  const { user } = ctx.request.body; // if none, assign user with {}

  if (!user) {
    ctx.throw(400, "Bad request. You didn't provide user column.");
  }
  if (!user.email || !user.name || !user.password) {
    ctx.throw(400, "Bad request. You didn't provide sufficient information.");
  }

  user.uuid = uuidv4();
  user.password = await argon2.hash(user.password);

  await db('users').insert(humps.decamelizeKeys(user));

  ctx.logined = true;
  ctx.session.account = user.email;
  ctx.status = 200;
  ctx.body = { user: _.omit(user, ['password']) };
};

export default register;
