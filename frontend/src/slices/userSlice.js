import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import userService from '../services/user'
import loginService from '../services/login'


export const initializeUser = createAsyncThunk('user/initialize', async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    
    if (loggedUserJSON) {
        try {
            const user = JSON.parse(loggedUserJSON)
            if (user.token) {
                return await userService.getUserDetails(user.token)
            }
        } catch (error) {
            console.error('Failed to initialize user:', error)
            return null;
        }
    }
    return null;
})

export const userLogin = createAsyncThunk('user/login', async (credentials) => {
    return await loginService.login(credentials)
})

const userSlice = createSlice({
    name: 'user',
    initialState: {user: null},
    reducers: {
        logOutUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.fulfilled, (state, action) => {
                window.localStorage.setItem('loggedUser', JSON.stringify(action.payload))
                state.user = action.payload.user
            })
            .addCase(initializeUser.fulfilled, (state, action) => {
                console.log("Initializing user.")
                state.user = action.payload
            })
          .addCase(userLogin.rejected, (state, action) => {

          })
    }
})

export const { logOutUser } = userSlice.actions
export default userSlice.reducer
