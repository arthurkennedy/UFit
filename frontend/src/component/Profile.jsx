import {useSelector, useDispatch} from 'react-redux'


import myImage from "../assets/profile.jpg"
import "../style/profile.css"
import CreateTeam from "./CreateTeam.jsx";
//import TeamsList from "./TeamsList.jsx"; moved to EditTeam.JSX

export default function Profile() {
	const user = useSelector((state) => state.user.user)

	console.log("user", user)

	const convertMetersToInches = (meters) => meters * 39.3701
	const convertMetersToFeetAndInches = (meters) => {
		const totalInches = convertMetersToInches(meters)
		const feet = Math.floor(totalInches / 12)
		const inches = Math.round(totalInches % 12)

		return {
			feet,
			inches
		}
	}
	const calculateBMI = (weightInPounds, heightInInches) => (weightInPounds / (heightInInches * heightInInches)) * 703

	const {feet, inches} = convertMetersToFeetAndInches(user.height)

	const myProfile = {
		username: user.username,
		height: `${feet}' ${inches}"`,
		weight: `${user.weight} lbs.`,
		bmi: `${calculateBMI(user.weight, convertMetersToInches(user.height)).toFixed(2)}%`
	}

	return (
		<div className='page-contents-container'>
			<div className="profile row">
				<div className="left">
					<img src={myImage} style={{"borderRadius": "50px"}} width="100"/>
					
				</div>
				<div className="right">
					<div className="box">
						<div className="row">
						{myProfile.username}
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
			{/*<CreateTeam/>*/}
			{/*/<TeamsList/>*/}
		</div>
	)
}