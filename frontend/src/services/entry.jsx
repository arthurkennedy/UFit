import axios from 'axios'
const baseUrl = '/api/entry'

const post = async (entry, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await axios.post(baseUrl, entry, config)
    return response.data
}

const getFeed = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await axios.get(baseUrl, config)
    return response.data
}

export default {
    post,
    getFeed
}