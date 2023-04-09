/* eslint-disable import/no-extraneous-dependencies */
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const users = [
  {
    name: 'admin',
    email: 'admin@gmail.com',
    id: '1',
  },
  {
    name: 'demo',
    email: 'demo@gmail.com',
    id: '2',
  },
  {
    name: 'jack',
    email: 'jack@gmail.com',
    id: '3',
  },
  {
    name: 'johnjacob',
    email: 'john@gmail.com',
    id: '4',
  },
];

export function getUsers() {
  return users.map((u) => ({
    id: u.id,
    email: u.email || `${u.name}@demo.com`,
    name: u.name,
    password: bcrypt.hashSync('X12345678', 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function seed(knex) {
  if (process.env.NODE_ENV === 'production') {
    await knex('users')
      .whereIn(
        'email',
        users.map((u) => u.email || `${u.name}@demo.com`),
      )
      .del();
  } else {
    await knex('users').del();
  }

  return knex('users').insert(getUsers());
}
