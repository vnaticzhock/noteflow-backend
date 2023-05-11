/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import sendEmail from '../../lib/email.js';
import crypto from 'crypto-js';
import HTML_TEMPLATE from '../../lib/mail-template.js';
import { createUserBucket } from '../../model/mongodb/model/index.js';

let { EMAIL_USER, EMAIL_HOST } = process.env;

const register = async (ctx) => {
    try {
        const { user } = ctx.request.body; // if none, assign user with {}

        if (!user) {
            ctx.throw(400, "Bad request. You didn't provide user column.");
        }
        if (!user.email || !user.name || !user.password) {
            ctx.throw(
                400,
                "Bad request. You didn't provide sufficient information."
            );
        }

        // create User
        const result = await db('users').first().where({ email: user.email });
        if (result) {
            ctx.throw(401, 'Forbidden, you already have  an email.');
        }

        var userId = null;
        var randomString = Math.random().toString(15);
        var token = crypto.SHA256(randomString).toString(crypto.enc.Hex);
        var verifyMessage = 'An Email sent to your account please verify';
        var password = await argon2.hash(user.password);

        const userValidate = await db('users')
            .insert({
                uuid: uuidv4(),
                name: user.name,
                password: password,
                email: user.email,
                token: token,
            })
            .returning('*')
            .then((rows) => {
                console.log(
                    'User created successfully. New user id is:',
                    rows[0].id
                );
                userId = rows[0].id;
            });

        const message = `${EMAIL_HOST}/api/user/verify/${userId}/${token}`;
        // await sendEmail(user.email, 'Verify Email', verifyMessage);

        sendEmail({
            subject: '【noteflow】 Verify Email',
            text: message,
            to: user.email,
            from: EMAIL_USER,
            html: HTML_TEMPLATE(message),
        });

        await createUserBucket(user.email);

        ctx.status = 200;
        ctx.body = verifyMessage;
    } catch (err) {
        console.log(err);
        ctx.status = err.status || 500;
        ctx.body = JSON.stringify({ errors: err.message });
    }
};

export default register;
