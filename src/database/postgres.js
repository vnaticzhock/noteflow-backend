import * as dotenv from 'dotenv';
import Pg from 'pg';


dotenv.config({ path: 'config/.env.development' });

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  // MONGO_INITDB_ROOT_USERNAME,
  // MONGO_INITDB_ROOT_PASSWORD
} = process.env;

const postgres = new Pg.Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
});

export default postgres;
