import {useSelector} from 'react-redux'
import defaultProfilePicture from "../assets/profile.jpg"
import "../style/profile.css"
import {convertMetersToInches, calculateBMI, convertMetersToFeetAndInches} from "../utils/conversionFunctions.js";

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
			<h1>My Page</h1>
			<div className="profile row">
				<div className="left">
					<img src={myProfile.picture} style={{"borderRadius": "50px"}} width="100"/>
					
				</div>
				<div className="right">
					<div className="box">
						<div className="row">
						{myProfile.username}
						</div>
						<div className="row">
							<div className="label">POINTS:</div>
							<div>UB{/*myProfile.point*/}256</div>
						</div>
						<div className="row">
							<div className="label">SCORE:</div>
							<div>Ufit Score{/*myProfile.score*/}</div>
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
						<div className='row'>
							<a href="/profile-settings">Edit Profile</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}