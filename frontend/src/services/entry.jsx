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
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await api.get(baseUrl, config)
    return response.data
}

const addReply = async(entry, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }

    const response = await api.post(baseUrl + "/reply", entry, config)
    return response.data
}

const getReplies = async(entryId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    }
    const response = await api.get(`${baseUrl}/replies/${entryId}`, config)
    return response.data
}

const toggleLike = async (entryId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    };

    try {
        const response = await api.put(`${baseUrl}/${entryId}/like`, {}, config);
        return response.data
    } catch (error) {
        // Handle errors appropriately
        console.error('Error liking post:', error)
        throw error
    }
};


export default {
    post,
    getFeed,
    addReply,
    getReplies,
    toggleLike
}