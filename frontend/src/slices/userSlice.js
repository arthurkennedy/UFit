import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import loginService from '../services/login'

export const userLogin = createAsyncThunk('user/login', async (credentials) => {
    return await loginService.login(credentials)
})


const userSlice = createSlice({
    name: 'user',
    initialState: {user: null},
    reducers: {
        logOutUser: (state) => {
            state.user = null;
        },
        initializeUser: (state) => {
            const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedUser'))
            state.user = loggedUserJSON && loggedUserJSON.user ? loggedUserJSON.user : null
        },
        addNewTeam: (state, action) => {
            state.user.teams = [...state.user.teams, action.payload]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.fulfilled, (state, action) => {
                window.localStorage.setItem('loggedUser', JSON.stringify(action.payload))
                state.user = action.payload.user
            })
    }
})

export const {logOutUser, initializeUser, addNewTeam} = userSlice.actions
export default userSlice.reducer
