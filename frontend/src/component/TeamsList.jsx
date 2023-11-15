import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const TeamsList = () => {
    const user = useSelector(state => state.user.user)
    const teams = user.teams
    const adminTeams = teams.filter((team) => user.id === team.admin.toString())
    const nonAdminTeams = teams.filter((team) => user.id !== team.admin.toString())

    return (
        <div>
            <ul>
                <h3>Teams I admin</h3>
                {adminTeams.length > 0 ?
                    adminTeams.map((team) => (
                        <li key={team.id} className="admin-team">{team.name}
                            <br/>
                            <Link to={`/admin/teams/${team.id}`}>
                                <button className={"uButton2"}>View</button>
                            </Link>
                        </li>
                    )) : "None"}
                <h3>Teams I am in</h3>
                {nonAdminTeams.length > 0 ? nonAdminTeams.map((team) => (
                    <li key={team.id}>{team.name}</li>
                )) : "None"}
            </ul>
        </div>
    )
}

export default TeamsList