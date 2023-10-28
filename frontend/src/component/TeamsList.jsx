import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const TeamsList = () => {
	const user = useSelector(state => state.user.user)
	const teams = user.teams
	console.log(user)
	const adminTeams = teams.filter((team) => user.id === team.admin.toString())
	const nonAdminTeams = teams.filter((team) => user.id !== team.admin.toString())

	console.log(adminTeams)
	console.log(nonAdminTeams)

	return (
		<div>
			<h3>Teams</h3>
			<ul>
				{adminTeams.map((team) => (
					<li key={team.id} className="admin-team">{team.name}
						<Link to={`/admin/teams/${team.id}`}>
							<button>Edit</button>
						</Link>
					</li>
				))}
				{nonAdminTeams.map((team) => (
					<li key={team.id}>{team.name}</li>
				))}
			</ul>
		</div>
	)
}

export default TeamsList