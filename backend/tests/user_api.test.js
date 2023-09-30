const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')


describe('when there is initially two users in db', () => {
	beforeEach(async () => {
		const initialUsers = [
			{
				'username': 'test_user',
				'passwordHash': 'test',
				'first_name': 'testerson',
				'last_name': 'mctest',
				'email': 'mctest@gmail.com',
				'age': 1,
				'gender': 'Male',
				'weight': 175.3
			},
			{
				'username': 'test_user2',
				'passwordHash': 'test2',
				'first_name': 'testerson2',
				'last_name': 'mctest2',
				'email': 'mctest2@gmail.com',
				'age': 1,
				'gender': 'Female',
				'weight': 179.3
			}
		]

		await User.deleteMany({})
		await User.insertMany(initialUsers)
	}, 10000)

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			'username': 'valid_user',
			'password': 'valid',
			'first_name': 'validerson',
			'last_name': 'validuser',
			'email': 'validuser@gmail.com',
			'age': 1,
			'gender': 'Male',
			'weight': 175.3
		}

		newUser.password = await bcrypt.hash(newUser.password, 10)

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with with proper status code and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			'username': 'test_user',
			'password': 'test',
			'first_name': 'testerson',
			'last_name': 'mctest',
			'email': 'mctest@gmail.com',
			'age': 1,
			'gender': 'Male',
			'weight': 175.3
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('expected `username` to be unique')
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
