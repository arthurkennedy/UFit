import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import loginService from '../services/login'

export const userLogin = createAsyncThunk('user/login', async (credentials) => {
	return await loginService.login(credentials)
})

export const validateUserToken = createAsyncThunk('user/validateUserToken', async (token) => {
	return await loginService.validateToken(token)
})


const userSlice = createSlice({
	name: 'user',
	initialState: {user: null, token: null},
	reducers: {
		logOutUser: (state) => {
			state.user = null
			state.token = null
		},
		addNewTeam: (state, action) => {
			state.user.teams = [...state.user.teams, action.payload]
		},
		addNewInvite: (state, action) => {
			const invite = action.payload
			const team = state.user.teams.find(team => team.id === invite.team)
			team.invitations = [...team.invitations, invite]
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(userLogin.fulfilled, (state, action) => {
				state.token = action.payload.token
				state.user = action.payload.user
			})
			.addCase(validateUserToken.fulfilled, (state, action) => {
				console.log(action.payload)
				if (!action.payload.valid) {
					state.user = null
					state.token = null
				}
			})
	}
})

export const {logOutUser, initializeUser, addNewInvite, addNewTeam} = userSlice.actions
export default userSlice.reducer
