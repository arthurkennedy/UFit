import {useState, useEffect} from 'react'
import userService from '../services/user'
import inviteService from '../services/teamInvitation'
import { addNewInvite } from '../slices/userSlice.js'
import {useDispatch, useSelector} from "react-redux"

const SearchUsers = ({teamId}) => {
	const [searchTerm, setSearchTerm] = useState('')

	const [users, setUsers] = useState([])

	const user = useSelector(state => state.user.user)
	const team = user.teams.find(team => team.id === teamId)
	const token = useSelector(state => state.user.token)
	const dispatch = useDispatch()

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			const performSearch = async () => {
				try {
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
		dispatch(addNewInvite(response))

	}

	const invite = (invitee) => {
		const previousInvite = team.invitations.find(invitation => invitation.invitee === invitee)
		if (previousInvite) {
			const state = previousInvite.state
			return (<span className={state}>{state}</span>)
		} else {
			return <button onClick={() => handleInvite(invitee)}>invite</button>
		}
	}

	return (
		<div className='whiteBox'>
			<h3>Search and add..</h3>
			<input
				type="text"
				placeholder="Search for users..."
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
			/>
			<ul>
				{users.map(user => (
					<li key={user.id}>{user.username} {invite(user.id)}</li>
				))}
			</ul>
		</div>

	)
}

export default SearchUsers
