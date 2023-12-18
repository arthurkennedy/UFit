import axios from 'axios';

// Create an axios instance
const api = axios.create({
	baseURL: '/api',
});

// Use an interceptor to inspect incoming responses
api.interceptors.response.use(
	async response => {
		return response;
	},
	async error => {
		if (error.response && error.response.status === 401) {
			const { store } = await import('../store')
			const { logOutUser } = await import('../slices/userSlice')
			// Log out user by resetting user and token state
			store.dispatch(logOutUser())

			// Redirect to login page
			window.location.href = '/login'
		}

		return Promise.reject(error)
	}
)

export default api
