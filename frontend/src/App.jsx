import {useState, useEffect} from 'react'
import loginService from './services/login'

function App() {

    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if(loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({username, password})
            setUser(user)
            setUsername('')
            setPassword('')

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
        } catch (exception) {
            console.log("error with user login. invalid credentials.")
        }
    }

    return (
    <>
        <h1>uFit App</h1>
        {user ? (
            <div>{user.username} is logged in</div>
        ) : (
            <>
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
        )}
    </>
    )
}

export default App
