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
			'weight': 175.3
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

		expect(response.body.username).toEqual('test_user')
		expect(response.body.token).toBeDefined()
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
