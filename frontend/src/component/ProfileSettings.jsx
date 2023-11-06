import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useState} from "react";

import myImage from "../assets/profile.jpg"

const ProfileSettings = () => {
	const user = useSelector((state) => state.user.user)

	//set myImage to user picture data url if available
	user.picture? myImage = user.picture: null;
    
    const initialUserState = {
		picture: myImage,
		username: user.username,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		password: "",
		age: user.age,
		weight: 150,
		heightFt: 5,
		heightIn: 8
	}

	const [newUserState, setNewUserState] = useState(initialUserState)
	const [errors, setErrors] = useState({})
	const navigate = useNavigate()

	const validationRules = {
		username: {
			rule: username => username.length >= 3,
			message: "Username must be 3 characters or more."
		},
		firstname: {
			rule: firstname => /^[a-zA-Z ]+$/.test(firstname),
			message: "First name should only contain letters and spaces."
		},
		lastname: {
			rule: lastname => /^[a-zA-Z ]+/.test(lastname),
			message: "Last name should only contain letters and spaces."
		},
		email: {
			rule: email => /\S+@\S+\.\S+/.test(email),
			message: "Please enter your email address in format: yourname@example.com"
		},
		password: {
			rule: (value) => value.length >= 3,
			message: "Password must be 3 characters or more."
		}
	}

	const handleChange = (e, field) => {
		const val = e.target.value
		setNewUserState({...newUserState, [field]: val})
		if (validationRules[field].rule(val)) {
			setErrors({...errors, [field]: null})
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		
	}

	//handle image discard
	const handleDiscard = async () => {
		//the timeout prevents trigger of "Change Image" button on mouseup
		setTimeout(() => {
			setNewUserState({...newUserState, ["picture"]: myImage})
		}, 0);
	}

	//read image file
	const readFile = (e) => {
		const file = e.target.files[0];

		if(file){
			const reader = new FileReader();

			reader.onload = function (event) {
				const dataURI = event.target.result;

				const img = new Image();

				img.onload = function (){
					//image maximum width and height
					const maxWidth = 100;
					const maxHeight = 100;

					let newWidth, newHeight;
					if (img.width > img.height) {
					newWidth = maxWidth;
					newHeight = (img.height / img.width) * maxWidth;
					} else {
					newWidth = (img.width / img.height) * maxHeight;
					newHeight = maxHeight;
					}

					const canvas = document.createElement('canvas');
					canvas.width = newWidth;
					canvas.height = newHeight;

					const ctx = canvas.getContext('2d');
        			ctx.drawImage(img, 0, 0, newWidth, newHeight);

					//get the data url as a webp, which supports images with transparent background
					const newDataURL =  canvas.toDataURL('image/webp',0.79);

					console.log(newDataURL, newDataURL.length);

					//store data url to Initial User State
					setNewUserState({...newUserState, ["picture"]: newDataURL})

				};

				img.src = dataURI;

			};  

			reader.readAsDataURL(file);
		}

	}

	return (
		<>
			<div className="comp-container">
				<div className="inner-container">
					<h2>Profile Settings</h2>
					<form onSubmit={handleSubmit}>
						<div>
							<img src={newUserState.picture} width="100"/>
							
							{

								newUserState.picture === myImage ? (
									<div>
										<label className='image-button' htmlFor="picture">
											Change Image
											<input onChange={readFile} type="file" id="picture" accept="image/*" hidden/>
										</label>
									</div>
								) : (
									<div>
										<label onMouseUp={handleDiscard} className='image-button'>Discard</label>
										<button className='image-button'>Save Image</button>
									</div>
								)
							}
						</div>
					</form>
				</div>
			</div>
		</>
		
	)
}

export default ProfileSettings