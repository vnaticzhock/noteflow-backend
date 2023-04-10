/* eslint-disable import/no-extraneous-dependencies */
import argon2 from 'argon2';
import shajs from 'sha.js';

const PrepareData = async () => [
  {
    name: 'admin',
    email: 'admin@gmail.com',
    id: '1',
    password: await argon2.hash(shajs('sha256').update('112a').digest('hex')),
  },
];

export async function getUsers() {
  const users = await PrepareData();

  return users.map((u) => ({
    id: u.id,
    email: u.email || `${u.name}@demo.com`,
    name: u.name,
    password: u.password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function seed(knex) {
  const users = await PrepareData();
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

  return knex('users').insert(await getUsers());
}
