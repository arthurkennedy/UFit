import TeamsList from "./TeamsList.jsx";
import UserInvitationsList from "./UserInvitationsList.jsx";
import CreateTeam from "./CreateTeam.jsx";

const MyTeams =()=>{
    return(
        <div className="page-contents-container">
          <div className="row">
            <div className="left w50">
                <div className="page-contents">
                    <h1>Team Quick Actions</h1>
                </div>

                <div className="page-contents">
                  <UserInvitationsList/>
                </div>

                <div className="page-contents">
                    <TeamsList/>
                </div>
          
            </div>
            <div className="right w50">
              <div className="page-contents">
                <CreateTeam />
                </div>
            </div>
          </div>
          
         
        </div>
    )
};
export default MyTeams;