import {useState, useEffect} from 'react'
import userService from '../services/user'

const SearchUsers = ({teamId}) => {
	const [searchTerm, setSearchTerm] = useState('')

	const [users, setUsers] = useState([])

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
					<li key={user.id}>{user.username}</li>
				))}
			</ul>
		</div>

	)
}

export default SearchUsers
