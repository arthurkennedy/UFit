import axios from 'axios'
const baseUrl = '/api/teamInvitation'

const getTeamInvitations = async (token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	const response = await axios.get(baseUrl, config)
	return response.data
}

const inviteUser = async (token, invite)  => {
	const config = {
		headers: { Authorization: `Bearer ${token}` }
	}
	const response = await axios.post(baseUrl, invite, config)
	return response.data
}

const respondToInvitation = async (invitationId, action, token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	console.log(action)
	const response = await axios.put(`${baseUrl}/${invitationId}`, {action}, config)
	return response.data
}

export default {
	getTeamInvitations,
	respondToInvitation,
	inviteUser
}