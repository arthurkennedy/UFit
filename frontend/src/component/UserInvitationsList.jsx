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
		const result = await teamInvitationService.respondToInvitation(invitationId, action, window.localStorage.getItem('loggedUser'))
		console.log(result)
	}

	return (
		<div>
			<h3>Team Invitations</h3>
			<ul>
				{invitations.map((invitation) => (
					<li key={invitation.id}>
						{invitation.team.name}
						<button className={"yes"} onClick={() => handleInvitation(invitation._id, 'ACCEPT')}>Accept</button>
						<button className={"no"} onClick={() => handleInvitation(invitation._id, 'REJECT')}>Reject</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default UserInvitationsList;
