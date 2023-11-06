import api from "./apiInterceptor"
const baseUrl = '/users'

const signup = async newUserDetails => {
    const response = await api.post(baseUrl, newUserDetails)
    return response.data
}

const getUserDetails = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }
    const response = await api.get(`${baseUrl}`, config);
    return response.data;
}

const searchUsers = async (teamId, searchTerm, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            teamId,
            searchTerm
        }
    }
    const response = await api.get('/users/search', config)
    return response.data
}

const editProfile = async (user, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }
    const response = await api.put(`${baseUrl}/profile`, {user}, config)
    return response.data
}

export default {
    signup,
    getUserDetails,
    searchUsers,
    editProfile
}