import api from "./apiInterceptor"
const baseUrl = '/entry'

const post = async (entry, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await api.post(baseUrl, entry, config)
    return response.data
}

const getFeed = async (token) => {
    console.log(token)
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await api.get(baseUrl, config)
    return response.data
}

const addReply = async(entry,token) => {

    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await api.post(baseUrl + "/reply", entry, config)
    return response.data
}

export default {
    post,
    getFeed,
    addReply
}