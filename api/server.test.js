// Write your tests here
const db = require('../data/dbConfig');
const Users = require('./auth/auth-model');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

beforeEach(async () => {
	await db('users').truncate();
});

test('we are using the correct environment', () => {
	expect(process.env.NODE_ENV).toBe('testing');
});

describe('tests the users model', () => {
	test('the table is empty', async () => {
		const users = await db('users');
		expect(users).toHaveLength(0);
	});

	test('users can be inserted', async () => {
		const result = await Users.createUser({
			username: 'foo',
			password: 'bar',
		});
		expect(result).toEqual({ id: 1, username: 'foo', password: 'bar' });
		let users = await db('users');
		expect(users).toHaveLength(1);
	});

	test('can get user by id', async () => {
		const insert = await Users.createUser({
			username: 'foo',
			password: 'bar',
		});
		expect(insert).toEqual({ id: 1, username: 'foo', password: 'bar' });
		const result = await Users.findById(1);
		expect(result).toEqual({ id: 1, username: 'foo', password: 'bar' });
	});

	test('can get user by username', async () => {
		const insert = await Users.createUser({
			username: 'foo',
			password: 'bar',
		});
		expect(insert).toEqual({ id: 1, username: 'foo', password: 'bar' });
		const usernameInput = 'foo';
		const result = await Users.findUser(usernameInput);
		expect(result).toEqual({ id: 1, username: 'foo', password: 'bar' });
	});
});

describe('test server endpoints', () => {
	test('call the `up` endpoint', async () => {
		const result = await request(server).get('/');
		expect(result.status).toBe(200);
		expect(result.body).toEqual({ api: 'up' });
	});

	test('[POST] /api/auth/register', async () => {
		let result = await request(server)
			.post('/api/auth/register')
			.send({ username: 'foo', password: 'bar' });

		expect(result.status).toBe(200);
	});

	test('[POST] /api/auth/login', async () => {
		const insert = await Users.createUser({
			username: 'foo',
			password: 'bar',
		});
		expect(insert).toEqual({ id: 1, username: 'foo', password: 'bar' });
		const usernameInput = 'foo';
		const result = await Users.findUser(usernameInput);
		expect(result).toEqual({ id: 1, username: 'foo', password: 'bar' });

		let finalResult = await request(server)
			.post('/api/auth/login')
			.send({ username: 'foo', password: 'bar' });

		expect(finalResult.status).toBe(200);
	});
});
