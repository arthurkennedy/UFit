import axios from 'axios'
const baseUrl = '/api/users'

const signup = async newUserDetails => {
    const response = await axios.post(baseUrl, newUserDetails)
    return response.data
}

const getUserDetails = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }
    const response = await axios.get(`${baseUrl}`, config);
    return response.data;
}

export default {
    signup,
    getUserDetails
}