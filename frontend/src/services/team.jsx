import axios from 'axios'

const baseUrl = "/api/team"

const createTeam = async (team, token) => {
	const config = {
		headers: { Authorization: `Bearer ${token}`}
	}

	const response = await axios.post(baseUrl, team, config)
	return response.data
}

export default {
	createTeam
}
