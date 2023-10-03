import axios from 'axios'
const baseUrl = '/api/users'

const signup = async newUserDetails => {
    const response = await axios.post(baseUrl, newUserDetails)
    return response.data
}

export default {
    signup
}