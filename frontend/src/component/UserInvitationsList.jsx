import { useEffect, useState } from 'react'
import teamInvitationService from '../services/teamInvitation'

const UserInvitationsList = () => {
	const [invitations, setInvitations] = useState([])

	useEffect(() => {
		const getInvitations = async () => {
			const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedUser'))
			console.log(loggedUserJSON)
			const invitations = await teamInvitationService.getTeamInvitations(loggedUserJSON.token)
			setInvitations(invitations)
		}
		getInvitations()
	}, [])

	const handleInvitation = async (invitationId, action) => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		const token = JSON.parse(loggedUserJSON).token
		const result = await teamInvitationService.respondToInvitation(invitationId, action, token)
		console.log(result)
	}

	return (
		<div>
			<h3>Team Invitations</h3>
			<ul>
				{invitations.map((invitation) => (
					<li key={invitation.id}>
						{invitation.team.name}
						<button onClick={() => handleInvitation(invitation.id, 'ACCEPT')}>Accept</button>
						<button onClick={() => handleInvitation(invitation.id, 'REJECT')}>Reject</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default UserInvitationsList;
