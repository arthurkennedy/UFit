const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
	await User.deleteMany({})
	await User.insertMany(helper.initialUsers)
})
test('a valid user can be added', async () => {
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

	await api
		.post('/api/users')
		.send(newUser)
		.expect(201)
		.expect('Content-Type', /application\/json/)
})

afterAll(async () => {
	await mongoose.connection.close()
})
