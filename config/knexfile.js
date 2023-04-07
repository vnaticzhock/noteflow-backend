import path from 'path';
import { pg } from 'pg';
require('dotenv').config();

const BASE_PATH = path.join(__dirname, 'src', 'database');

export default {
	test: {
		client: 'pg',
		connection: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
		migrations: {
			directory: path.join(BASE_PATH, 'migrations'),
		},
		seeds: {
			directory: path.join(BASE_PATH, 'seeds'),
		},
	},
	development: {
		client: 'pg',
		connection: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
		migrations: {
			directory: path.join(BASE_PATH, 'migrations'),
		},
		seeds: {
			directory: path.join(BASE_PATH, 'seeds'),
		},
	},
};