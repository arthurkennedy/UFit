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

	test('invitations are properly retrieved for a given user', async () => {
		const teamInvitationData = {
			admin: adminUser._id,
			invitee: nonAdminUser._id,
			team: team._id
		}
		await api
			.post('/api/teamInvitation')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(teamInvitationData)
			.expect(200)

		const response = await api
			.get('/api/teamInvitation')
			.set('Authorization', `Bearer ${nonAdminToken}`)
			.expect(200)

		expect(response.body).toHaveLength(1)

		const user = await User.findById(nonAdminUser._id)
		expect(user.invitations).toHaveLength(1)
	})

	test('user can accept a team invitation', async () => {
		const invitation = new TeamInvitation({
			admin: adminUser._id,
			invitee: nonAdminUser._id,
			team: team._id
		})
		await invitation.save()

		const inviteAcceptedResponse = await api
			.put(`/api/teamInvitation/${invitation._id}`)
			.set('Authorization', `Bearer ${nonAdminToken}`)
			.send({ action: 'ACCEPT' })
			.expect(200)

		expect(inviteAcceptedResponse.body.invitation.state).toEqual('ACCEPTED')
	})

	test('user can reject a team invitation', async () => {
		const invitation = new TeamInvitation({
			admin: adminUser._id,
			invitee: nonAdminUser._id,
			team: team._id
		})
		await invitation.save()

		const inviteAcceptedResponse = await api
			.put(`/api/teamInvitation/${invitation._id}`)
			.set('Authorization', `Bearer ${nonAdminToken}`)
			.send({ action: 'REJECTED' })
			.expect(200)

		expect(inviteAcceptedResponse.body.invitation.state).toEqual('REJECTED')
	})

	test('handle invalid action on a team invitation', async () => {
		// Create an invitation first
		const invitation = new TeamInvitation({
			admin: adminUser._id,
			invitee: nonAdminUser._id,
			team: team._id
		})
		await invitation.save()

		// Send an invalid action
		await api
			.put(`/api/teamInvitation/${invitation._id}`)
			.set('Authorization', `Bearer ${nonAdminToken}`)
			.send({ action: 'INVALID_ACTION' })
			.expect(400) // Bad Request or appropriate error code
	})

	test('action on already responded team invitation', async () => {
		// Create and accept/reject an invitation first
		const invitation = new TeamInvitation({
			admin: adminUser._id,
			invitee: nonAdminUser._id,
			team: team._id,
			state: 'ACCEPTED' // or 'REJECTED'
		})
		await invitation.save()

		// Try to accept/reject again
		await api
			.put(`/api/teamInvitation/${invitation._id}`)
			.set('Authorization', `Bearer ${nonAdminToken}`)
			.send({ action: 'ACCEPT' }) // or 'REJECT'
			.expect(404) // Not Found or appropriate error code
	})

})