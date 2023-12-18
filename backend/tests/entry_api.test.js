const mongoose = require('mongoose')
const supertest = require('supertest')
const mockdate = require('mockdate')
const app = require('../app')

const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')
const Entry = require('../models/entry')
const Team = require('../models/team')

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
			'weight': 175.3,
			'height': 1.7256
		}

		await User.deleteMany({})
		await Entry.deleteMany({})
		await Team.deleteMany({})
		user = new User(initialUserData)
		await user.save()
		const response = await api
			.post('/api/login')
			.send({ 'username': 'test_user', 'password': 'test' })

		token = response.body.token
	}, 10000)

	test('entry can be created by authorized user', async () => {
		const entry = {
			content: 'Test post!'
		}
		const response = await api
			.post('/api/entry')
			.set('Authorization', 'Bearer ' + token)
			.send(entry)
			.expect(200)

		expect(response.body.content).toEqual('Test post!')
		expect(response.body.user).toEqual({ id: user._id.toString(), participation_points: 1, username: 'test_user' })
	})

	test('entry cannot be created by unauthorized user', async () => {
		const entry = {
			content: 'Test post!'
		}
		const response = await api
			.post('/api/entry')
			.set('Authroization', 'Bearer ' + 'invalid')
			.send(entry)
			.expect(401)
		expect(response.error = 'Token missing or invalid')
	})
	describe('with teams, users, and entries populated',() => {
		let team1
		beforeEach(async () => {
			// Create and save teamMember1 and teamMember2
			const teamMemberData = {
				'username': 'teamMember',
				'passwordHash': 'tester',
				'first_name': 'team',
				'last_name': 'member',
				'email': 'team@member.com',
				'age': 1,
				'gender': 'Male',
				'weight': 175.3,
				'height': 1.7256
			}
			let teamMember1 = await User.findOne({ username: 'teamMember1' })
			if (!teamMember1) {
				teamMember1 = new User({ ...teamMemberData, username: 'teamMember1', email: 'team1@member.com', passwordHash: 'taaaasat' })
				await teamMember1.save()
			}

			let teamMember2 = await User.findOne({ username: 'teamMember2' })
			if (!teamMember2) {
				teamMember2 = new User({ ...teamMemberData, username: 'teamMember2', email: 'team2@member.com' })
				await teamMember2.save()
			}

			// Create teams and add members
			team1 = new Team({ name: 'Team1', members: [{ user: user._id }, { user: teamMember1._id }], admin: user._id })
			const team2 = new Team({ name: 'Team2', members: [{ user: user._id }, { user:teamMember2._id }], admin: user._id })
			await team1.save()
			await team2.save()

			// Create entries
			const entry1 = new Entry({ content: 'Test1', user: user._id })
			const entry2 = new Entry({ content: 'Test2', user: teamMember1._id })
			const entry3 = new Entry({ content: 'Test3', user: teamMember2._id })
			mockdate.set('2021-01-01')
			await entry1.save()
			mockdate.set('2021-01-02')
			await entry2.save()
			mockdate.set('2021-01-03')
			await entry3.save()

			// Add teams to the user
			user.teams = [team1._id, team2._id]
			await user.save()
		}, 10000)

		test('entries are retrieved based on user team membership', async () => {
			const response = await api.get('/api/entry').set('Authorization', `Bearer ${token}`)
			expect(response.status).toBe(200)
			expect(response.body).toHaveLength(3)
		})

		test('entries are retrieved correctly for a specific team', async () => {
			const teamResponse = await api.get(`/api/entry/team?teamId=${team1._id.toString()}`).set('Authorization', `Bearer ${token}`)
			expect(teamResponse.status).toBe(200)
			expect(teamResponse.body).toHaveLength(2)
		} )

		test('entries are retrieved in the correct order', async () => {
			const response = await api.get('/api/entry').set('Authorization', `Bearer ${token}`)
			const timestamps = response.body.map(entry => new Date(entry.createdAt).getTime())
			expect(timestamps[0]).toBeGreaterThanOrEqual(timestamps[1])
			expect(timestamps[1]).toBeGreaterThanOrEqual(timestamps[2])
		})

		afterEach(async () => {
			mockdate.reset()
		})
	})

})

afterAll(async () => {
	await mongoose.connection.close()
})
