import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useState} from "react";
import userService from "../services/user.jsx";

import Cropper from 'react-easy-crop'
import myImage from "../assets/profile.jpg"

const ProfileSettings = () => {
	const user = useSelector((state) => state.user.user)
	const token = useSelector((state) => state.user.token);

	//set myImage to user picture data url if available
	user.picture? myImage = user.picture: null;
	//let myImage = user.picture;

	function drawDefaultImage() {
		// Draw user initials
		/**
		 * Logic to translate:
		 * <html lang="en">
		 *   <head>
		 *     <script src="stack1.js"></script>
		 *   </head>
		 *   <body onload="draw();">
		 *     <canvas id="canvas" width="180" height="180"></canvas>
		 *   </body>
		 * </html>
		 *
		 * function draw() {
		 *   const canvas = document.getElementById('canvas');
		 *   const ctx = canvas.getContext('2d');
		 *   let img = new Image();
		 *   img.addEventListener("load", ()=>{
		 *     ctx.drawImage(img,0,0);
		 *     ctx.font = '50px serif';
		 *     ctx.fillText('Hello world', 50, 90);
		 *   });
		 *   img.src = "backdrop.png";
		 * }
		 * Valtoni Boaventura on StackOverflow
		 * https://stackoverflow.com/questions/70324406/how-to-add-text-to-an-image-and-users-can-also-saved-the-image-with-the-added-te#:~:text=just%20draw%20the%20image%20when,the%20stuff%20drawn%20on%20canvas.
		 */

		return(myImage)
	}

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

	//image crop states 
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedDataURL, setCroppedDataURL] = useState("");

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
		console.log("field",field)
		if (validationRules[field]?.rule(val)) {
			setErrors({...errors, [field]: null})
		}
	}

	//handle image discard
	const handleDiscard = async () => {
		setNewUserState({...newUserState, ["picture"]: myImage})
	}

	//handle image onCropComplete
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		if(croppedAreaPixels){
			const img = new Image();

			img.onload = function (){
			
				const croppedX = croppedAreaPixels.x, croppedY = croppedAreaPixels.y;
				const croppedWidth = croppedAreaPixels.width, croppedHeight = croppedAreaPixels.height;
				
				const canvas = document.createElement('canvas');
				canvas.width = croppedWidth;
				canvas.height = croppedHeight;

				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, -(croppedX), -(croppedY));

				//get the data url as a webp, which supports images with transparent background
				const dataURL =  canvas.toDataURL('image/webp');

				setCroppedDataURL(dataURL);
			};

			img.src = newUserState.picture;

		}
	}


	//we can choose to trim our image further with this trimImage function
	//This is important because larger images may cause storage issue.
	//default size is 100x100
	const trimImage = (dataURL, size) => {
		return new Promise((resolve, reject) => {
			const img = new Image();

			img.onload = function () {
				// image maximum width and height
				const maxWidth = size? size.width : 100;
				const maxHeight = size? size.height : 100;
			
				let newWidth, newHeight;
				if (maxWidth > img.height) {
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
			
				// get the data URL as a webp, which supports images with a transparent background
				const newDataURL = canvas.toDataURL('image/webp', 0.79);
			
				resolve(newDataURL);
			};
		
			img.onerror = (error) => {
				reject(error); // Handle any errors that may occur during image loading
			};
		
			img.src = dataURL;
		});
	};

	//read image file
	const readFile = (e) => {
		const file = e.target.files[0];

		if(file){
			const reader = new FileReader();

			reader.onload = function (event) {
				const dataURI = event.target.result;

				console.log(dataURI);

				//store data url to Initial User State
				setNewUserState({...newUserState, ["picture"]: dataURI})
			}; 

			reader.readAsDataURL(file);
		}

	}

	//handle image submit
	const handleImageSubmit = async (event) => {
		event.preventDefault()

		//do the backend stuff with this data string
		const trimmedDataURL = await trimImage(croppedDataURL);

		console.log("trim: ", trimmedDataURL);

	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		let isValid = true
		let newErrors = {}

		for (const [field, {rule, message}] of Object.entries(validationRules)) {
			const val = newUserState[field]
			if (!rule(val)) {
				isValid = false
				newErrors[field] = message
			}
		}
		setErrors(newErrors)

		if (isValid) {
			try {
				const updateUser = {...newUserState}
				updateUser.height = (updateUser.heightFt * .3048) + (updateUser.heightIn * 0.0252) // convert to meters
				delete updateUser.heightFt
				delete updateUser.heightIn

				console.log("did i get token?", updateUser, token)
				await userService.editProfile(updateUser, token)
				//await userService.(newUser)
				//navigate('/')
			} catch (exception) {
				setErrors({'username': 'That username is already taken. Please try another.'})
				console.log("error registering user: ", exception.message)
			}
		}
	}

	return (
		<>
			<div className="comp-container">
				<div className="inner-container">
					<h2>Profile Settings (Under Construction)</h2>
					<form onSubmit={handleSubmit}>
					<div>
						<label>
							<b>Username: </b>
							{errors.username ? <div className="error-text" id="username-error">{errors.username}</div> : null}
							<input
								type="text"
								value={newUserState.username}
								name="Username"
								onChange={e => handleChange(e, 'username')}
								placeholder="Username"
							/>
						</label>
					</div>
					<div>
						<label>
							<b>Password: </b>
							{errors.password ? <div className="error-text" id="password-error">{errors.password}</div> : null}
							<input
								type="password"
								value={newUserState.password}
								name="Password"
								onChange={e => handleChange(e, 'password')}
								placeholder="Password"
							/>
						</label>
					</div>
					<div>
						<label>
							<b>First name: </b>
							{errors.firstname ? <div className="error-text" id="firstname-error">{errors.firstname}</div> : null}
							<input
								type="text"
								value={newUserState.firstname}
								name="first-name"
								onChange={e => handleChange(e, 'firstname')}
								placeholder="First Name"
							/>
						</label>
					</div>

					<div>
						<label>
							<b>Last name: </b>
							{errors.lastname ? <div className="error-text" id="lastname-error">{errors.lastname}</div> : null}
							<input
								type="text"
								value={newUserState.lastname}
								name="last-name"
								onChange={e => handleChange(e, 'lastname')}
								placeholder="Last Name"
							/>
						</label>
					</div>

					<div>
						<label>
							<b>Email: </b>
							{errors.email ? <div className="error-text" id="email-error">{errors.email}</div> : null}
							<input
								type="email"
								value={newUserState.email}
								name="Email"
								onChange={e => handleChange(e, 'email')}
								placeholder="Email"
							/>
						</label>
					</div>
					<div className="row">
						<div>
							<label>
								<b>Age: </b>
								<input
									type="number"
									min="1"
									max="120"
									value={newUserState.age}
									name="age"
									onChange={e => handleChange(e, 'age')}
								/>
							</label>
						</div>
						<div>
							<label>
								<b>Weight (lbs): </b>
								<input
									type="number"
									min="1"
									max="400"
									value={newUserState.weight}
									name="age"
									onChange={e => {
										handleChange(e, 'weight')
									}}
								/>
							</label>
						</div>
						<div>
							<b>Height: </b> {newUserState.heightFt}{"'"} {newUserState.heightIn}{'"'}
							<div className="row">
								<label>
									<input
										type="number"
										value={newUserState.heightFt}
										name="heightFt"
										onChange={e => handleChange(e, 'heightFt')}
									/>
								</label>
								<label>
									<input
										type="number"
										value={newUserState.heightIn}
										name="heightIn"
										onChange={e => handleChange(e, 'heightIn')}
									/>
								</label>
							</div>
						</div>
					</div>
					<button type="submit">Update Profile</button>
				</form>

					<hr/>
					<form onSubmit={handleImageSubmit}>
						<div>
							
							{

								newUserState.picture === myImage ? (
									
									<>
										<div className='image-container'>
											<img src={myImage} />
										</div>
										<label className='image-button' htmlFor="picture">
											Change Image
											<input onChange={readFile} type="file" id="picture" accept="image/*" hidden/>
										</label>
									</>
								) : (
									<>
										<div className='image-container crop-container'>
											<Cropper
												image={newUserState.picture}
												crop={crop}
												zoom={zoom}
												aspect={4 / 3}
												onCropChange={setCrop}
												onCropComplete={onCropComplete}
												onZoomChange={setZoom}
											/>
										</div>
										<div className="controls">
											<input
											type="range"
											value={zoom}
											min={1}
											max={3}
											step={0.1}
											aria-labelledby="Zoom"
											onChange={(e) => {
												setZoom(e.target.value)
											}}
											className="zoom-range"
											/>
										</div>
										<div>
											<button onClick={handleDiscard} className='image-button'>Discard</button>
											<button className='image-button'>Save Image</button>
										</div>
									</>
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