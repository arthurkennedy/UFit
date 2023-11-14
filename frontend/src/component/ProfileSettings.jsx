import {useDispatch, useSelector} from 'react-redux'
import {useRef, useState} from "react";
import userService from "../services/user.jsx";
import Cropper from 'react-easy-crop'
import defaultPicture from "../assets/profile.jpg"
import {convertFeetAndInchesToMeters, convertMetersToFeetAndInches} from "../utils/conversionFunctions.js";
import {updateProfile} from "../slices/userSlice.js";


const ProfileSettings = () => {
	const user = useSelector((state) => state.user.user)
	const token = useSelector((state) => state.user.token)

	const dispatch = useDispatch()

	const [toggleEdit, setToggleEdit] = useState(false)
	const fileInputRef = useRef(null)

	//set myImage to user picture data url if available
	let myImage = user.picture ? user.picture : defaultPicture

	const {feet, inches} = convertMetersToFeetAndInches(user.height)
	const initialUserState = {
		picture: myImage,
		username: user.username,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		password: "",
		age: user.age,
		weight: user.weight,
		heightFt: feet,
		heightIn: inches
	}

	//image crop states 
	const [crop, setCrop] = useState({x: 0, y: 0})
	const [zoom, setZoom] = useState(1)
	const [croppedDataURL, setCroppedDataURL] = useState("")

	const [newUserState, setNewUserState] = useState(initialUserState)


	const handleChange = (e, field) => {
		let val = e.target.value
		if (field === 'age' || field === 'weight') {
			val = Number(val)
		}
		setNewUserState({...newUserState, [field]: val})
	}

	//handle image discard
	const handleDiscard = () => {
		const updated = {...newUserState, picture: myImage}
		setNewUserState(updated)
		setCroppedDataURL("")
		setToggleEdit(false)
	}

	//handle image onCropComplete
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		if (croppedAreaPixels) {
			const img = new Image()

			img.onload = function () {

				const croppedX = croppedAreaPixels.x, croppedY = croppedAreaPixels.y
				const croppedWidth = croppedAreaPixels.width, croppedHeight = croppedAreaPixels.height

				const canvas = document.createElement('canvas')
				canvas.width = croppedWidth
				canvas.height = croppedHeight

				const ctx = canvas.getContext('2d')
				ctx.drawImage(img, -(croppedX), -(croppedY))

				//get the data url as a webp, which supports images with transparent background
				const dataURL = canvas.toDataURL('image/webp')

				setCroppedDataURL(dataURL)
			}
			img.src = newUserState.picture
		}
	}


	//we can choose to trim our image further with this trimImage function
	//This is important because larger images may cause storage issue.
	//default size is 100x100
	const trimImage = (dataURL, size) => {
		return new Promise((resolve, reject) => {
			const img = new Image()

			img.onload = function () {
				// image maximum width and height
				const maxWidth = size ? size.width : 500
				const maxHeight = size ? size.height : 500

				let newWidth, newHeight
				if (maxWidth > img.height) {
					newWidth = maxWidth
					newHeight = (img.height / img.width) * maxWidth
				} else {
					newWidth = (img.width / img.height) * maxHeight
					newHeight = maxHeight
				}

				const canvas = document.createElement('canvas')
				canvas.width = newWidth
				canvas.height = newHeight

				const ctx = canvas.getContext('2d')
				ctx.drawImage(img, 0, 0, newWidth, newHeight)

				// get the data URL as a webp, which supports images with a transparent background
				const newDataURL = canvas.toDataURL('image/webp', 1)

				resolve(newDataURL)
			}

			img.onerror = (error) => {
				reject(error); // Handle any errors that may occur during image loading
			}

			img.src = dataURL
		})
	}

	//read image file
	const readFile = (e) => {
		const file = e.target.files[0]
		console.log(file)
		if (file) {
			const reader = new FileReader()

			reader.onload = function (event) {
				const dataURI = event.target.result
				//store data url to Initial User State
				setNewUserState({...newUserState, picture: dataURI})
			}
			reader.readAsDataURL(file)
			setToggleEdit(true)
		}
	}

	const handleEditPicture = () => {
		fileInputRef.current.value = ''
		fileInputRef.current.click()
	}

	//handle image submit
	const handleImageSubmit = async (event) => {
		event.preventDefault()

		//do the backend stuff with this data string
		const trimmedDataURL = await trimImage(croppedDataURL)
		setNewUserState({...newUserState, picture: trimmedDataURL})
		setToggleEdit(false)
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const updateUser = {...newUserState}
		updateUser.height = convertFeetAndInchesToMeters(updateUser.heightFt, updateUser.heightIn)
		delete updateUser.heightFt
		delete updateUser.heightIn
		const updatedUser = await userService.editProfile(updateUser, token)
		dispatch(updateProfile(updatedUser))
	}

	return (
		<>
			<div className="comp-container">
				<div className="inner-container">

					<h2>Profile Settings (Under Construction)</h2>
					<form onSubmit={handleImageSubmit}>
						<div>
							{
								toggleEdit ?
									(
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
												<button type='submit' className='image-button'>Crop</button>
											</div>
										</>
									)
									: (
										<>
											<div className='image-container'>
												<img src={newUserState.picture}/>
											</div>
											<button className='image-button' onClick={handleEditPicture}>Edit Profile Picture</button>
											<input
												ref={fileInputRef}
												onChange={readFile}
												type="file"
												id="picture"
												accept="image/*"
												hidden
											/>
										</>
									)
							}
						</div>
					</form>
					<form onSubmit={handleSubmit}>
						<div className="row user-details">
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
										name="weight"
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
						<button type="submit">Save Changes</button>
					</form>
				</div>
			</div>
		</>

	)
}

export default ProfileSettings