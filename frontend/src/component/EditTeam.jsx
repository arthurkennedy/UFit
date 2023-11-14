import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import SearchUsers from "./SearchUsers.jsx";

const EditTeam = () => {
	const {teamId} = useParams()
	const user = useSelector(state => state.user.user)
	const team = user.teams.find(team => team.id === teamId)

	return (

		<div className="page-contents-container">
			<div className="page-contents">
				<a className="goback-button" href="/teams">&lt;&lt; Back To Teams</a>
			</div>
			<div className="page-contents">
				<h1>Edit Team</h1>

			</div>

			<div className="page-contents">
				<div>
					<b>Name: </b>{team.name}
				</div>
			</div>

			<div className="page-contents">
				<SearchUsers teamId={teamId}/>
			</div>
	
		</div>
	)
}

export default EditTeam