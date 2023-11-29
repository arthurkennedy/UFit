import {useSelector} from 'react-redux'
import defaultProfilePicture from "../assets/profile.jpg"
import "../style/profile.css"
import {convertMetersToInches, calculateBMI, convertMetersToFeetAndInches} from "../utils/conversionFunctions.js";
import Widget from "./Widget.jsx";

export default function Profile() {
	const user = useSelector((state) => state.user.user)

	const {feet, inches} = convertMetersToFeetAndInches(user.height)

	const myProfile = {
		picture: user.picture ? user.picture : defaultProfilePicture,
		username: user.username,
		height: `${feet}' ${inches}"`,
		weight: `${user.weight} lbs.`,
		bmi: `${calculateBMI(user.weight, convertMetersToInches(user.height)).toFixed(2)}%`
	}

	return (
		<div className='page-contents-container'>
			<div className='page-contents'>
				<h3>HomePage</h3>
			</div>
			<div className={"row"}>
				<div className="left w50">
					<h1>My Info</h1>
					<div className="profile">
						<div className="left">
							<img alt={"My Picture"} src={myProfile.picture} style={{"borderRadius": "50px"}} width="100"/>

						</div>
						<div className="right">
							<div className="box">
								<div className="row header">
									{myProfile.username}
								</div>
								<div className="row">
									<div className="label">POINTS:</div>
									<div>UB{/*myProfile.point*/}256</div>
								</div>
								<div className="row">
									<div className="label">HEIGHT:</div>
									<div>{myProfile.height}</div>
								</div>
								<div className="row">
									<div className="label">WEIGHT:</div>
									<div>{myProfile.weight}</div>
								</div>
								<div className="row">
									<div className="label">BMI:</div>
									<div>{myProfile.bmi}</div>
								</div>
								<div className='row btn-row'>
									<a href="/profile-settings">Edit Profile</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={"right w50"}>
					<h1>Widget Bar</h1>
					<div className={"row"}>
						<div className={"left w50"}>
							<button>➖</button>
							Feed Recap
							<Widget data={
								//Pull HTML for each widget
								<>
									<h1>Feed:</h1>
									<h1>Feed:</h1>
								</>
							}></Widget>
						</div>
						<div className={"right w50"}>
							<button>➖</button>
							Team News
							<Widget data={"??"}></Widget>
						</div>
					</div>
					<div className={"row"}>
						<div className={"left w50"}>
							<button>➖</button>
							Store Widget
							<Widget data={"??"}></Widget>
						</div>
						<div className={"right w50"}>Add Widget
							<button>➕</button>
							<Widget data={"??"}></Widget>
						</div>
					</div>
					<div className={"row"}>
						<div className={"left w50"}>Add Widget
							<button>➕</button>
							<Widget data={"??"}></Widget>

						</div>
						<div className={"right w50"}>Add Widget
							<button>➕</button>
							<Widget data={"??"}></Widget>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}