const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const bcrypt = require('bcrypt')
const mockdate = require('mockdate')
const User = require('../models/user')
const Entry = require('../models/entry')
const Team = require('../models/team')
const { runNightlyDistribution } = require('../utils/cronJobs')

describe('given a team with points per distribution of 1000 and users A, B, and C with participation points 3, 1, and 7 respectively', () => {
	let userA
	let userB
	let userC
	let team
	beforeEach(async () => {
		await User.deleteMany({})
		await Entry.deleteMany({})
		await Team.deleteMany({})

		const initialUserData = {
			'first_name': 'testerson',
			'last_name': 'mctest',
			'age': 1,
			'gender': 'Male',
			'weight': 175.3,
			'height': 1.7256
		}

		userA = new User({
			...initialUserData, username: 'userA', passwordHash: 'testA', email: 'a@gmasedfkja.com', participation_points: 3
		})
		userB = new User({
			...initialUserData, username: 'userB', passwordHash: 'testB', email: 'b@dfmadfam.com', participation_points: 1
		})
		userC = new User ({
			...initialUserData, username: 'userC', passwordHash: 'testC', email: 'dasfm@sldkjfa.com', participation_points: 7
		})
		await userA.save()
		await userB.save()
		await userC.save()

		team = new Team({
			name: 'Test Team',
			admin: userA._id,
			members: [{ user: userB._id }, { user: userC._id }],
			total_points: 1000,
		})

		team.subscription = {
			schedule: 'MONTHLY',
			distributionSchedule: 'WEEKLY',
			type: 'BENEFACTOR',
			pointPool: 1000,
			nextDistributionDate: new Date(),
			pointsPerDistribution: 1000
		}

		await team.save()
	}, 100000)

	test('points are distributed correctly based on participation points', async () => {
		// Call the function to distribute points
		await runNightlyDistribution()

		// Retrieve updated user data from the database
		const updatedUserA = await User.findById(userA._id)
		const updatedUserB = await User.findById(userB._id)
		const updatedUserC = await User.findById(userC._id)


		// Calculate expected points
		const totalParticipation = 3 + 1 + 7 // Total participation points from userA, userB, userC
		const expectedPointsA = (3 / totalParticipation) * 1000 // User A's share
		const expectedPointsB = (1 / totalParticipation) * 1000 // User B's share
		const expectedPointsC = (7 / totalParticipation) * 1000 // User C's share

		// Assert that points are correctly distributed
		expect(updatedUserA.ufit_points).toBeCloseTo(expectedPointsA)
		expect(updatedUserB.ufit_points).toBeCloseTo(expectedPointsB)
		expect(updatedUserC.ufit_points).toBeCloseTo(expectedPointsC)
	})

	test('participation points are reset after distribution', async () => {
		// Call the function to distribute points
		await runNightlyDistribution()

		// Assert that participation points are reset to zero
		const users = await User.find({ _id: { $in: [userA._id, userB._id, userC._id] } })
		users.forEach(user => {
			expect(user.participation_points).toBe(0)
		})
	})

	test('next distribution date is updated correctly', async () => {
		// Call the function to distribute points
		await runNightlyDistribution()

		// Retrieve updated team data
		const updatedTeam = await Team.findById(team._id)

		// Assert that the next distribution date is set correctly
		const expectedNextDistributionDate = new Date()
		expectedNextDistributionDate.setDate(expectedNextDistributionDate.getDate() + 7) // Assuming weekly distribution
		expect(updatedTeam.subscription.nextDistributionDate).toEqual(expectedNextDistributionDate)
	})

	afterEach(async () => {
		mockdate.reset()
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})
})