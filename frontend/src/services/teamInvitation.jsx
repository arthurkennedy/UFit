import axios from 'axios'
const baseUrl = '/api/teamInvitation'

const getTeamInvitations = async (token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	const response = await axios.get(baseUrl, config)
	return response.data
}

const respondToInvitation = async (invitationId, action, token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	const response = await axios.put(`${baseUrl}/${invitationId}`, config)
	return response.data
}

export default {
	getTeamInvitations,
	respondToInvitation
}