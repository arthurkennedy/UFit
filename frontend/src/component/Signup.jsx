import { useNavigate } from 'react-router-dom'
import userService from "../services/user.jsx";
import { useState } from "react";

const Signup = () => {
    const initialUserState = {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        age: 1,
        weight: 1
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
            rule:  firstname => /^[a-zA-Z ]+$/.test(firstname),
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
        setNewUserState({ ...newUserState, [field]: val })
        if(validationRules[field].rule(val)) {
            setErrors({ ...errors, [field]: null })
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        let isValid = true;
        let newErrors= {};

        for (const [field, {rule, message}] of Object.entries(validationRules)) {
            const val = newUserState[field]
            if(!rule(val)) {
                isValid = false
                newErrors[field] = message
            }
        }
        setErrors(newErrors)

        if (isValid) {
            try {
                await userService.signup(newUserState)
                navigate('/login')
            } catch (exception) {
                setErrors({'username': 'That username is already taken. Please try another.'})
                console.log("error registering user: ", exception.message)
            }
        }
    }

    return (
      <div className="comp-container">
        <div className="inner-container">
          <h2>User Signup</h2>
          <form onSubmit={handleSubmit}>
            <div>
                <label>
                    <b>Username: </b>
                    {errors.username ? <div className="error-text" id="username-error">{errors.username}</div> : null }
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
                    <b>First name: </b>
                    {errors.firstname ? <div className="error-text" id="firstname-error">{errors.firstname}</div> : null }
                    <input
                        type="text"
                        value={newUserState.firstname}
                        name="first-name"
                        onChange={e => handleChange(e, 'firstname')}
                        placeholder="First Name..."
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>Last name: </b>
                    {errors.lastname ? <div className="error-text" id="lastname-error">{errors.lastname}</div> : null }
                    <input
                        type="text"
                        value={newUserState.lastname}
                        name="last-name"
                        onChange={e => handleChange(e, 'lastname')}
                        placeholder="Last Name..."
                    />
                </label>
            </div>

            <div>
              <label>
                  <b>Email: </b>
                  {errors.email ? <div className="error-text" id="email-error">{errors.email}</div> : null }
                  <input
                    type="email"
                    value={newUserState.email}
                    name="Email"
                    onChange={e => handleChange(e, 'email')}
                    placeholder="email..."
                  />
              </label>
            </div>

            <div>
                <label>
                    <b>Password: </b>
                    {errors.password ? <div className="error-text" id="password-error">{errors.password}</div> : null }
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
                    <b>Age: </b>
                    <input
                        type="number"
                        min="1"
                        max="120"
                        value={newUserState.age}
                        name="age"
                        onChange={e => handleChange(e, 'age')}
                        placeholder="Age..."
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>Weight: </b>
                    <input
                        type="number"
                        min="1"
                        max="400"
                        value={newUserState.weight}
                        name="age"
                        onChange={e => {handleChange(e, 'weight')}}
                        placeholder="Weight..."
                    />
                </label>
            </div>
            <button type="submit">SignUp</button>
          </form>
        </div>
      </div>
    )
  }
  
  export default Signup