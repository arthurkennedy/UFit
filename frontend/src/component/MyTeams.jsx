import TeamsList from "./TeamsList.jsx";
import UserInvitationsList from "./UserInvitationsList.jsx";
import CreateTeam from "./CreateTeam.jsx";

const MyTeams =()=>{
    return(
        <div className="page-contents-container">
            <div className="page-contents">
                <h1>Team Quick Actions</h1>
			    <UserInvitationsList/>
            </div>

            <div className="page-contents">
                <TeamsList></TeamsList>
            </div>
          <div>
            <CreateTeam />
          </div>
        </div>
    )
};
export default MyTeams;