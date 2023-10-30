import { useState } from 'react'
import { useDispatch } from 'react-redux'
import teamService from '../services/team'
import { addNewTeam } from '../slices/userSlice.js'

const CreateTeam = () => {
	const [name, setName] = useState('')

	const dispatch = useDispatch()

	const handleSubmit = async (event) => {
		event.preventDefault()

		const newTeam = {
			name: name
		}
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		const token = JSON.parse(loggedUserJSON).token
		const createdTeam = await teamService.createTeam(newTeam, token)
		dispatch(addNewTeam(createdTeam))
		setName('')
	}

	return (
		<div>
			<h3>Create a New Team</h3>
			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Team Name:</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button class="uButton2" type="submit">Create Team</button>
			</form>
		</div>
	)
}

export default CreateTeam
