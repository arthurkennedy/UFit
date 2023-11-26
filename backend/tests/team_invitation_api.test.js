const supertest = require('supertest')
const bcrypt  = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const Team = require('../models/team')
const TeamInvitation = require('../models/team_invitation')

let adminToken, nonAdminToken, adminUser, nonAdminUser, team

describe('with team, admin, and nonAdmin information populated', () => {
	beforeEach(async () => {
		await User.deleteMany({})
		await Team.deleteMany({})
		await TeamInvitation.deleteMany({})

		const adminPassHash = await bcrypt.hash('adminPass', 10)
		const nonAdminPassHash = await bcrypt.hash('nonAdminPass', 10)

		const adminUserData = {
			'username': 'adminUser',
			'first_name': 'testerson',
			'last_name': 'mctest',
			'email': 'mctest2@gmail.com',
			'age': 1,
			'gender': 'Male',
			'weight': 175.3,
			'height': 1.7256,
			'passwordHash': adminPassHash
		}
		const nonAdminUserData = {
			'username': 'nonAdminUser',
			'first_name': 'testerson',
			'last_name': 'mctest',
			'email': 'mctest1@gmail.com',
			'age': 1,
			'gender': 'Male',
			'weight': 175.3,
			'height': 1.7256,
			'passwordHash': nonAdminPassHash
		}
		adminUser = new User(adminUserData)
		nonAdminUser = new User(nonAdminUserData)

		await adminUser.save()
		await nonAdminUser.save()

		const response1 = await api
			.post('/api/login')
			.send({ 'username': 'adminUser', 'password': 'adminPass' })

		adminToken = response1.body.token

		const response2 = await api
			.post('/api/login')
			.send({ 'username': 'nonAdminUser', 'password': 'nonAdminPass' })

		nonAdminToken = response2.body.token

		team = new Team({
			'name': 'Team A',
			admin: adminUser._id
		})
		await team.save()
		adminUser.teams = [...adminUser.teams, team._id]
	}, 10000)
	test('valid team invitation can be created by team admin', async () => {
		const teamInvitationData = {
			admin: adminUser._id,
			invitee: nonAdminUser._id,
			team: team._id
		}
		const response = await api
			.post('/api/teamInvitation')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(teamInvitationData)
			.expect(200)

		expect(response.body).toHaveProperty('team', team._id.toString())
		expect(response.body).toHaveProperty('state', 'PENDING')
		expect(response.body).toHaveProperty('invitee', nonAdminUser._id.toString())

		const updatedTeam = await Team.findById(team._id)
		expect(updatedTeam.invitations).toHaveLength(1)
		const updatedInvitee = await User.findById(nonAdminUser._id)
		expect(updatedInvitee.invitations).toHaveLength(1)
	})

	test('non-admin user cannot create a team invitation', async () => {
		const teamInvitationData = {
			admin: nonAdminUser._id,
			invitee: adminUser._id,
			team: team._id
		}
		await api
			.post('/api/teamInvitation')
			.set('Authorization', `Bearer ${nonAdminToken}`)
			.send(teamInvitationData)
			.expect(401)
	})
})