/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import argon2 from 'argon2';
import { ValidationError } from 'yup';
import db from '../../lib/db.js';

const login = async (ctx) => {
    try {
        const { user } = ctx.request.body;

        ctx.assert(
            _.isObject(user) && user.email && user.password,
            422,
            JSON.stringify({ errors: 'email or password input error' })
        );

        const result = await db('users').first().where({ email: user.email });
        ctx.assert(result, 401, JSON.stringify({ errors: 'email is invalid' }));

        console.log(result.password);
        console.log(user.password);
        var validate = await argon2.verify(result.password, user.password);
        console.log('val: ' + validate);

        ctx.assert(
            validate,
            401,
            JSON.stringify({ errors: 'password is invalid' })
        );
        console.log(ctx);

        user.name = result.name;

        ctx.session.logined = true;
        ctx.session.email = user.email;
        ctx.session.name = user.name;
        ctx.session.picture = user.picture;
        await ctx.session.save();

        ctx.status = 200;
        var userResult = JSON.stringify({ user: _.omit(user, ['password']) }); // 把 password 給挑掉
        ctx.body = JSON.parse(userResult);
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = JSON.parse(err.message);

        console.log(`[${ctx.status}] ${err.message}`);
    }
};

export default login;
