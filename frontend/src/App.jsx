import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import loginService from './services/login'

/*import components*/
import LoginPage from './component/LoginPage'
import Home from './component/Home'

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

        const navigate = useNavigate();

        try {
            const user = await loginService.login({username, password})
            setUser(user)
            setUsername('')
            setPassword('')

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            navigate.push('/');
        } catch (exception) {
            console.log("error with user login. invalid credentials.")
        }
    }

    return (
    <>
        <a className="app-name" href="/">
            <h1>U-FIT</h1>
        </a>

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home user={user}/>}/>
                <Route index element={<Home user={user}/>} />

                <Route path="/login" element={
                    <LoginPage 
                    username={username} 
                    password={password} 
                    handleUserLogin={userLogin} handleSetUsername={setUsername} handleSetPassword={setPassword} />
                } />

            </Routes>
        </BrowserRouter>
    </>
    )
}

/* <username={username} password={password}/> */

export default App
