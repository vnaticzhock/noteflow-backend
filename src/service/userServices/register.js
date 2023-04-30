/* eslint-disable import/no-extraneous-dependencies */
import humps from 'humps';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import argon2 from 'argon2';
import db from '../../lib/db.js';
import { createUserBucket } from '../../database/mongodb/model/index.js';
import nodemailer from 'nodemailer';
import google from 'googleapis';

const createTransporter = async () => {
  const oauth2Client = new google.Auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const register = async (ctx) => {
  const { user } = ctx.request.body; // if none, assign user with {}

  if (!user) {
    ctx.throw(400, "Bad request. You didn't provide user column.");
  }
  if (!user.email || !user.name || !user.password) {
    ctx.throw(400, "Bad request. You didn't provide sufficient information.");
  }

  //email verification
  // const sendEmail = async (emailOptions) => {
  //   let emailTransporter = await createTransporter();
  //   await emailTransporter.sendMail(emailOptions);
  // };

  // sendEmail({
  //   subject: "[SDM email verify]",
  //   text: "email verify",
  //   to: user.email,
  //   from: process.env.EMAIL
  // });

  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  const result = await db('users').first().where({ email: user.email });
  if(result) {
    ctx.throw(401, "Forbidden, you already have  an email.");
  }

  user.uuid = uuidv4();
  user.password = await argon2.hash(user.password);

  await db('users').insert(humps.decamelizeKeys(user));

  ctx.session.logined = true;
  ctx.session.email = user.email;
  ctx.session.name = user.name;
  ctx.session.picture = user.picture;
  await ctx.session.save();
  await createUserBucket(user.email);

  ctx.status = 200;
  ctx.body = { user: _.omit(user, ['password']) };
};

export default register;
