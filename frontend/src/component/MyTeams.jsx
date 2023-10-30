import TeamsList from "./TeamsList.jsx";
import UserInvitationsList from "./UserInvitationsList.jsx";

const MyTeams =()=>{
    return(
        <div className="page-contents-container">
            <div className="page-contents">
                <h1>Team Quick Actions</h1>
			    <UserInvitationsList/>
            </div>

            <div className="page-contents">
                <h1>Teams I'm In</h1>
                <TeamsList></TeamsList>
            </div>
        </div>
    )
};
export default MyTeams;