import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import SearchUsers from "./SearchUsers.jsx";
import EditTeam from "./EditTeam.jsx";

const TeamPage = () => {
	const {teamId} = useParams()
	const user = useSelector(state => state.user.user)
	const team = user.teams.find(team => team.id === teamId)

	return (
		<div className="page-contents-container">
			<div className="row">
				<div className="left w50">
					<div className="page-contents">
						<h1>Welcome to {team.name}</h1>
						<a className="goback-button" href="/teams">&lt;&lt; Back To Teams</a>
					</div>

					<div className="page-contents">
						<SearchUsers teamId={teamId}/>
					</div>

					<div className="page-contents">
					</div>

				</div>
				<div className="right w50">
					<div className="page-contents">
						<>
							<h1>Modify Team (to clean up)</h1>
							<button className={"goback-button"}>Let's Go</button><button className={"goback-button"}>Cancel</button>


							<EditTeam></EditTeam>
						</>
					</div>
				</div>
			</div>


		</div>
	)
}

export default TeamPage

/*
* <div className="page-contents-container">
          <div className="row">
            <div className="left w50">
                <div className="page-contents">
                    <h1>Team Quick Actions</h1>
                </div>

                <div className="page-contents">
                  <UserInvitationsList/>
                </div>

                <div className="page-contents">
                    <TeamsList></TeamsList>
                </div>

            </div>
            <div className="right w50">
              <div className="page-contents">
                <CreateTeam />
                </div>
            </div>
          </div>


        </div>
        *
        * <div className="page-contents-container">
			<div className="page-contents">
				<a className="goback-button" href="/teams">&lt;&lt; Back To Teams</a>
			</div>
			<div className="page-contents">
				<h1>Welcome to {team.name}<EditTeam></EditTeam></h1>

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
* */