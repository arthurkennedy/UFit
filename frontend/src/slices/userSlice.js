import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import userService from '../services/user'
import loginService from '../services/login'
import {useDispatch} from "react-redux";


export const initializeUser = createAsyncThunk('user/initialize', async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
        try {
            const user = JSON.parse(loggedUserJSON);
            if (user.token) {
                return await userService.getUserDetails(user.token);
            }
        } catch (error) {
            console.error('Failed to initialize user:', error);
            return null;
        }
    }
    return null;
})

export const userLogin = createAsyncThunk('user/login', async (credentials) => {
    const response = await loginService.login(credentials)
    return response
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
                console.log("Action payload: ", action.payload)
                window.localStorage.setItem('loggedUser', JSON.stringify(action.payload))
                const dispatch = useDispatch()
                dispatch(initializeUser())
            })
            .addCase(initializeUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
    }
})

export const { logOutUser } = userSlice.actions
export default userSlice.reducer
