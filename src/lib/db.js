import knex from 'knex';
import knexFile from '../../config/knexfile.js';

const db = knex(knexFile)

export default db;
