import path from 'path';
const BASE_PATH = `${process.cwd()}`;

export default {
	test: {
		client: 'pg',
		connection: `postgres://user:112a@localhost:5432/noteflow`,
		migrations: {
			directory: path.join(BASE_PATH, 'migrations'),
		},
		seeds: {
			directory: path.join(BASE_PATH, 'seeds'),
		},
	},
	development: {
		client: 'pg',
		connection: `postgres://user:112a@localhost:5432/noteflow`,
		migrations: {
			directory: path.join(BASE_PATH, 'migrations'),
		},
		seeds: {
			directory: path.join(BASE_PATH, 'seeds'),
		},
	},
	production: {
		client: 'pg',
		connection: `postgres://user:112a@localhost:5432/noteflow`,
		migrations: {
			directory: path.join(BASE_PATH, 'migrations'),
		},
		seeds: {
			directory: path.join(BASE_PATH, 'seeds'),
		},
	},
};