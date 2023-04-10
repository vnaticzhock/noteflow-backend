import Router from 'koa-router';
import argon2 from 'argon2';
import postgre from '../../database/posgres.js';
import getFlows from './getFlows.js';
import getDoc from './getDoc.js';
import getLibrary from './getLibrary.js';

const router = new Router()
.get('/get-flows', getFlows)
.get('/get-Doc', getDoc)
.get('/get-Library', getLibrary);

export default router;