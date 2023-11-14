import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { userLogin } from '../slices/userSlice.js'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('') // Local state to hold form values
  const [password, setPassword] = useState('') // Local state to hold form values

  const [isError, setIsError] = useState(false);

  const navigate = useNavigate()

  // Function to handle form submit
  async function handleLogin(e) {
    e.preventDefault();

    try {
      const action = await dispatch(userLogin({ username, password }))
      if (action.payload) {
        navigate("/")
      } else {
        throw new Error("Invalid Credentials")
      }
    } catch (exception) {
      setIsError(true)
      console.log("login error: ", exception.message)
    }
  }

  return (
      <div className="comp-container">
        <div className="inner-container">
          <h2>User Login</h2>
          <form onSubmit={handleLogin}>
            {isError ? <div className="error-text">Incorrect username or password</div> : null }
            <div>
              <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => {
                    setUsername(target.value)
                    setIsError(false)
                  }}
                  placeholder="Username"
              />
            </div>
            <div>
              <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => {
                    setPassword(target.value)
                    setIsError(false)
                  }}
                  placeholder="Password"
              />
            </div>
            <button className="submit-button" type="submit">LOGIN</button>
          </form>
          <button onClick={()=>navigate("/signup")}>SIGN UP</button>

        </div>
      </div>
  )
}

export default Login
