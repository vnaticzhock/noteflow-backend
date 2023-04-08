import dotenv from 'dotenv';
import knex from 'knex';
import knexfile from '../database/knexfile.js';

let db = null;
dotenv.config({path: "/config/.env"});

if(process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development') {
    console.log(knexfile.development);
    db = knex(knexfile.development);
   
}else{
    console.log("production");
    db = knex(knexfile.production)
}

export default db;