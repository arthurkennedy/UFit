import {useState, useEffect} from 'react'
import loginService from './services/login'
import LoginPage from './component/LoginPage'

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

    const userLogin = async (event) => {
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
        <h1 className="app-name">U-FIT</h1>

        {user ? (
            <div>{user.username} is logged in</div>
        ) : (
            <>
                <LoginPage 
                username={username} 
                password={password} 
                handleUserLogin={userLogin} handleSetUsername={setUsername} handleSetPassword={setPassword} />
            </>
        )}
    </>
    )
}

/* <username={username} password={password}/> */

export default App
