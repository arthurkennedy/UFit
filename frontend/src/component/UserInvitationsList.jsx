import {useEffect, useState} from 'react'
import teamInvitationService from '../services/teamInvitation'
import {useDispatch, useSelector} from "react-redux";
import {addNewTeam} from "../slices/userSlice.js";

const UserInvitationsList = () => {
	const token = useSelector(state => state.user.token)
	const dispatch = useDispatch()
	const [invitations, setInvitations] = useState([])

	useEffect(() => {
		const getInvitations = async () => {
			const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedUser'))
			return await teamInvitationService.getTeamInvitations(loggedUserJSON.token)
		}
		getInvitations().then(res => setInvitations(res))
	}, [])

	console.log(invitations)
	const handleInvitation = async (invitationId, action) => {
		const result = await teamInvitationService.respondToInvitation(invitationId, action, token)
		const team = result.team
		const updatedInvitation = result.invitation
		dispatch(addNewTeam(team))
		const updatedInvitations = invitations.map(invitation =>
			invitation.id === updatedInvitation.id ? updatedInvitation : invitation
		)
		setInvitations(updatedInvitations)
	}

	return (<div>
			<div className='whiteBox'>
			<h3>Team Invitations</h3>
			<ul>
				{invitations.map((invitation) => (<li key={invitation.id}>
						{invitation.team.name} {' '}
						{invitation.state === 'PENDING' ? <div>
							<button className={"yes"} onClick={() => handleInvitation(invitation.id, 'ACCEPT')}>Accept</button>{' '}
							<button className={"no"} onClick={() => handleInvitation(invitation.id, 'REJECT')}>Reject</button>
						</div> : <span className={invitation.state}>{invitation.state}</span>}
					</li>))}
			</ul>
			</div>
		</div>)
}

export default UserInvitationsList;
