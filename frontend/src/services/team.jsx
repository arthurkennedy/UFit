import api from "./apiInterceptor"

const baseUrl = "/team"

const createTeam = async (team, token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}`}
	}

	const response = await api.post(baseUrl, team, config)
	return response.data
}

export default {
	createTeam
}
