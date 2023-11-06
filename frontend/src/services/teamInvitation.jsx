import api from "./apiInterceptor"
const baseUrl = '/teamInvitation'

const getTeamInvitations = async (token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	const response = await api.get(baseUrl, config)
	return response.data
}

const inviteUser = async (token, invite)  => {
	const config = {
		headers: { Authorization: `Bearer ${token}` }
	}
	const response = await api.post(baseUrl, invite, config)
	return response.data
}

const respondToInvitation = async (invitationId, action, token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	const response = await api.put(`${baseUrl}/${invitationId}`, {action}, config)
	return response.data
}

export default {
	getTeamInvitations,
	respondToInvitation,
	inviteUser
}