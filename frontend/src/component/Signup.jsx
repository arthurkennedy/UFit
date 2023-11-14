import {useNavigate} from 'react-router-dom'
import userService from "../services/user.jsx";
import {useState} from "react";
import {convertFeetAndInchesToMeters} from "../utils/conversionFunctions.js";

// Fire DrawPFP upon signin/

const Signup = () => {
	const initialUserState = {
		username: '',
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		age: 18,
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
				const newUser = {...newUserState}
				newUser.height = convertFeetAndInchesToMeters(newUser.heightFt, newUser.heightIn) // convert to meters
				delete newUser.heightFt
				delete newUser.heightIn
				await userService.signup(newUser)
				navigate('/login')
			} catch (exception) {
				setErrors({'username': 'That username is already taken. Please try another.'})
				console.log("error registering user: ", exception.message)
			}
		}
	}

	return (
		<div className="comp-container">
			<br/> {/*Best to fix the spacing*/}
			<div className="inner-container">
				<h2>User Signup</h2>
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
										max="8"
										min="2"
										name="heightFt"
										onChange={e => handleChange(e, 'heightFt')}
									/>
								</label>
								<label>
									<input
										type="number"
										value={newUserState.heightIn}
										name="heightIn"
										max="12"
										min="0"
										onChange={e => handleChange(e, 'heightIn')}
									/>
								</label>
							</div>
						</div>
					</div>
					<button className="submit-button" type="submit">SignUp</button>
				</form>
				<button onClick={()=>navigate('/login')}>Log In</button>
				<br/>

			</div>
		</div>
	)
}

export default Signup