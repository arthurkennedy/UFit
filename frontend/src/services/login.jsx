import axios from 'axios'

const baseUrl = '/api/login'

const login = async credentials => {
	const response = await axios.post(baseUrl, credentials)
	return response.data;
}

const validateToken = async token => {
	try {
		const response = await axios.post(`${baseUrl}/validate`,{}, {
			headers: {'Authorization': `Bearer ${token}`}
		})
		return {valid: true, data: response.data}
	} catch(error) {
		return {valid:false, error: error.response.data}
	}
}


export default {
	login,
	validateToken
}