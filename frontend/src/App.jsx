import { useState } from 'react'

function App() {

    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])

    const handleLogin = (event) => {
        event.preventDefault()

    }

  return (
    <>
        <h1>uFit App</h1>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <div>
                username:
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password:
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    </>
  )
}

export default App
