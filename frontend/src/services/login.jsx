import axios from 'axios'
const baseUrl = '3001'

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default {
    login
}