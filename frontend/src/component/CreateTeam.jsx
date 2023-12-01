import { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import teamService from '../services/team'
import { addNewTeam } from '../slices/userSlice.js'

const CreateTeam = () => {
	const [name, setName] = useState('')
	const token = useSelector(state => state.user.token)
	const dispatch = useDispatch()

	const handleSubmit = async (event) => {
		event.preventDefault()

		const newTeam = {
			name: name
		}
		const createdTeam = await teamService.createTeam(newTeam, token)
		dispatch(addNewTeam(createdTeam))
		setName('')
	}
	return (
		<div>
			<h2>Create a New Team</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Team Name:</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<label htmlFor="type">Plan:</label>
				<select name="type" id="type">
					<option value="BENEFACTOR">Benefactor Plan 💸</option>
					<option value="MEMBERSHIP">Paid Plan 💳</option>
					<option value="FREE">Free Plan ⭐</option>
					<option value="HYBRID">Hybrid Plan 🔗</option>

				</select>
				<label htmlFor="schedule">Schedule:</label>
				<select name="schedule" id="schedule">
					<option value="DAILY">Every Day</option>
					<option value="WEEKLY">Each Week</option>
					<option value="MONTHLY">Per Month</option>
				</select>
				<label htmlFor="distribSchedule">Give Points:</label>
				<select name="distribSchedule" id="distribSchedule">
					<option value="DAILY">Every Day</option>
					<option value="WEEKLY">Each Week</option>
					<option value="MONTHLY">Per Month</option>
				</select>
				<label htmlFor="ptPool">Initial Point Pool</label>
				<input name={"ptPool"} id={"ptPool"} type="number"/>
				<label htmlFor="price">You will pay Points/100</label>
				<label htmlFor="price2">For example, 250 points cost $2.50</label>
				<button className="uButton2" type="submit">Create Team</button>
			</form>
		</div>
	)
}

export default CreateTeam
