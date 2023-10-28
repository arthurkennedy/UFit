import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const EditTeam = () => {
	const { teamId } = useParams()
	const user = useSelector(state => state.user.user)
	const team = user.teams.find(team => team.id === teamId)

	return (
		<div>{team.name}</div>
	)
}

export default EditTeam