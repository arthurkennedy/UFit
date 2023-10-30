const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

describe('when there is initially two users in db', () => {
	beforeEach(async () => {
		const passHash = await bcrypt.hash('test', 10)
		const initialUserData = {
			'username': 'test_user',
			'passwordHash': passHash,
			'first_name': 'testerson',
			'last_name': 'mctest',
			'email': 'mctest@gmail.com',
			'age': 1,
			'gender': 'Male',
			'weight': 175.3,
			'height': 1.73
		}

		await User.deleteMany({})
		const user = new User(initialUserData)
		await user.save()
	}, 10000)

	test('login succeeds with a valid username and password', async () => {
		const response = await api
			.post('/api/login')
			.send({ 'username': 'test_user', 'password': 'test' })
			.expect(200)

		expect(response.body.user.username).toEqual('test_user')
		expect(response.body.token).toBeDefined()
	})

	test('login fails with an invalid username or password', async () => {
		await api
			.post('/api/login')
			.send({ 'username': 'invalid_user', 'password': 'invalid_password' }) //invalid username or password
			.expect(401)
	})

	test('login fails with missing username or password', async () => {
		await api
			.post('/api/login')
			.send({}) // No username or password
			.expect(401)
	})

})

afterAll(async () => {
	await mongoose.connection.close()
})
