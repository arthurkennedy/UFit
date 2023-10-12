import { useState } from 'react'
import { useDispatch} from 'react-redux'
import {initializeUser, userLogin} from '../slices/userSlice.js'
import {useNavigate} from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('') // Local state to hold form values
  const [password, setPassword] = useState('') // Local state to hold form values

  const navigation = useNavigate()

  // Function to handle form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(userLogin({ username, password })).then(() => dispatch(initializeUser())).then(() => navigation("/"))
  }

  return (
      <div className="comp-container">
        <div className="inner-container">
          <h2>User Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                  placeholder="Username"
              />
            </div>
            <div>
              <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                  placeholder="Password"
              />
            </div>
            <button type="submit">LOGIN</button>
          </form>
        </div>
      </div>
  )
}

export default Login
