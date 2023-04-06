require('./src/lib/bootstrap');
const config = require('config');
const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, 'src', 'database');

module.exports = {
  local: {
    client: 'pg',
    connection: 'postgres://user:112a@localhost:5432/noteflow',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  development: {
    client: 'pg',
    connection: 'postgres://user:112a@localhost:5432/noteflow',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};
