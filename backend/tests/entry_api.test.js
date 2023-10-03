const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

let token

describe('when a user is logged in', () => {
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
		const response = await api
			.post('/api/login')
			.send({ 'username': 'test_user', 'password': 'test' })

		token = response.body.token
	})

	test('entry can be created by user', async () => {
		const entry = {
			content: 'Test post!'
		}
		const response = await api
			.post('/api/entry')
			.set('Authorization', 'Bearer ' + token)
			.send(entry)
			.expect(200)

		expect(response.body.content).toEqual('Test post!')
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
