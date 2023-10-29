import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const TeamsList = () => {
	const user = useSelector(state => state.user.user)
	const teams = user.teams
	const adminTeams = teams.filter((team) => user.id === team.admin.toString())
	const nonAdminTeams = teams.filter((team) => user.id !== team.admin.toString())

	return (
		<div >
			<h3>Teams</h3>
			<ul >
				{adminTeams.map((team) => (
					<li  key={team.id} className="admin-team">{team.name}
						<br/>
						<Link to={`/admin/teams/${team.id}`}>
							<button className={"uButton2"} >Edit This</button>
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