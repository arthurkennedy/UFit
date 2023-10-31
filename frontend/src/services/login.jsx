import api from "./apiInterceptor"
import axios from "axios";

const baseUrl = '/login'

const login = async credentials => {
	const response = await axios.post(`/api/${baseUrl}`, credentials)
	return response.data;
}

const validateToken = async token => {
	try {
		const response = await api.post(`${baseUrl}/validate`,{}, {
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