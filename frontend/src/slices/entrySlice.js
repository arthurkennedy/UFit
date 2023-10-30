import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import entryService from '../services/entry'

export const fetchEntries = createAsyncThunk('entries/fetchEntries', async (token) => {
	return await entryService.getFeed(token)
})

const entrySlice = createSlice({
	name: 'entries',
	initialState: { entries: [] },
	reducers: {
		addEntry: (state, action) => {
			state.entries = [action.payload, ...state.entries]
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchEntries.fulfilled, (state, action) => {
			state.entries = action.payload
		})
	}
})

export const {addEntry} = entrySlice.actions

export default entrySlice.reducer