const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Team = require('../models/team')
const User = require('../models/user')
const { convertMoneyToUfitPoints, calculateNumberOfDistributionPeriods } = require('../utils/participationUtils')

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
			admin: user._id,
			subscriptionDetails: {
				schedule: 'MONTHLY',
				distributionSchedule: 'WEEKLY',
				type: 'BENEFACTOR',
				memberFee: 10.00,
				adminFee: 0
			}
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
			'name': 'Team A',
			admin: user._id,
			subscriptionDetails: {
				schedule: 'MONTHLY',
				distributionSchedule: 'WEEKLY',
				type: 'BENEFACTOR',
				memberFee: 10.00,
				adminFee: 0
			}
		}
		await api
			.post('/api/team')
			.set('Authorization', 'Bearer ' + 'invalid')
			.send(team)
			.expect(401)

	})

	test('upon creation, team is added to user\'s team list', async () => {
		const team = {
			'name': 'Team A',
			admin: user._id,
			subscriptionDetails: {
				schedule: 'MONTHLY',
				distributionSchedule: 'WEEKLY',
				type: 'MEMBERSHIP',
				memberFee: 10.00,
				adminFee: 0
			}
		}
		await api
			.post('/api/team')
			.set('Authorization', 'Bearer ' + token)
			.send(team)
			.expect(200)

		user = await User.findById(user._id)

		expect(user.teams).toHaveLength(1)
	})

	test('team is created with correct distribution date and subscription details', async () => {
		const teamData = {
			name: 'Team D',
			subscriptionDetails: {
				schedule: 'MONTHLY',
				distributionSchedule: 'WEEKLY',
				type: 'HYBRID',
				memberFee: 10,
				adminFee: 5
			}
		}

		const response = await api
			.post('/api/team')
			.set('Authorization', `Bearer ${token}`)
			.send(teamData)
			.expect(200)

		const createdTeam = response.body

		const periods = calculateNumberOfDistributionPeriods('MONTHLY', 'WEEKLY')

		expect(createdTeam.name).toEqual('Team D')
		expect(createdTeam.subscription.schedule).toEqual('MONTHLY')
		expect(createdTeam.subscription.distributionSchedule).toEqual('WEEKLY')
		expect(createdTeam.subscription.type).toEqual('HYBRID')
		expect(createdTeam.subscription.pointPool).toBe(convertMoneyToUfitPoints(15))
		expect(createdTeam.subscription.pointsPerDistribution).toBe(convertMoneyToUfitPoints(15) / periods)

		// Check next distribution date
		const currentDate = new Date()
		currentDate.setHours(0, 0, 0, 0)
		const expectedDistributionDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7)
		expect(new Date(createdTeam.subscription.nextDistributionDate)).toEqual(expectedDistributionDate)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})