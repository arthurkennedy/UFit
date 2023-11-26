const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Team = require('../models/team')
const User = require('../models/user')

let token
let user
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

		await Team.deleteMany({})
		await User.deleteMany({})
		user = new User(initialUserData)
		await user.save()
		const response = await api
			.post('/api/login')
			.send({ 'username': 'test_user', 'password': 'test' })

		token = response.body.token
	}, 10000)

	test('team can be created by an authorized user', async () => {
		const team = {
			'name': 'Team A',
			admin: user._id
		}
		const response = await api
			.post('/api/team')
			.set('Authorization', 'Bearer ' + token)
			.send(team)
			.expect(200)

		expect(response.body.name).toEqual('Team A')
	})

	test('team cannot be created by an unauthorized user', async () => {
		const team = {
			name: 'Team A',
			admin: user._id
		}
		await api
			.post('/api/team')
			.set('Authorization', 'Bearer ' + 'invalid')
			.send(team)
			.expect(401)

	})

	test('upon creation, team is added to user\'s team list', async () => {
		const team = {
			name: 'Team A',
			admin: user._id
		}
		await api
			.post('/api/team')
			.set('Authorization', 'Bearer ' + token)
			.send(team)
			.expect(200)

		user = await User.findById(user._id)

		expect(user.teams).toHaveLength(1)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})