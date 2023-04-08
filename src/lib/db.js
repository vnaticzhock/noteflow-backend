import dotenv from 'dotenv';
import knex from 'knex';
import knexfile from '../database/knexfile.js';

const db = null;
dotenv.config({ path: '/config/.env' });

if (
  process.env.NODE_ENV === 'local' ||
  process.env.NODE_ENV === 'development'
) {
  db = knex(knexfile.development);
} else {
  db = knex(knexfile.production);
}

export default db;
