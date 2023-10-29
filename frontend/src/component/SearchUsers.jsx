import {useState, useEffect} from 'react'
import userService from '../services/user'
import inviteService from '../services/teamInvitation'
import {useSelector} from "react-redux";

const SearchUsers = ({teamId}) => {
	const [searchTerm, setSearchTerm] = useState('')

	const [users, setUsers] = useState([])

	const user = useSelector(state => state.user.user)

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			const performSearch = async () => {
				try {
					const loggedUserJSON = window.localStorage.getItem('loggedUser')
					const token = JSON.parse(loggedUserJSON).token
					const result = await userService.searchUsers(teamId, searchTerm, token)
					setUsers(result)
				} catch (error) {
					console.error('An error occurred: ', error)
				}
			}
			performSearch()
		}, 100)
		return () => clearTimeout(delayDebounceFn)
	}, [searchTerm])

	const handleInvite = async (invitee) => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		const token = JSON.parse(loggedUserJSON).token
		const response = await inviteService.inviteUser(token, {invitee: invitee, admin: user.id, team: teamId})
		if(response.invite) {

		}
	}

	const invite = (prevInvited, invitedStatus, invitee) => {
		if (prevInvited) {
			return ({invitedStatus})
		} else {
			return <button onClick={() => handleInvite(invitee)}>invite</button>
		}
	}

	return (
		<div>
			<h1>Search Users</h1>
			<input
				type="text"
				placeholder="Search for users..."
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
			/>
			<ul>
				{users.map(user => (
					<li key={user.id}>{user.username}<button>invite</button></li>
				))}
			</ul>
		</div>

	)
}

export default SearchUsers
