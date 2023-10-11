import {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom"

import loginService from './services/login'

/*import components*/
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import Home from './component/Home'
import UnknownEndpoint from './component/UnknownEndpoint.jsx'
import Feed from "./component/Feed.jsx";
import Profile from "./component/Profile.jsx";


const App = () => {
    //username and password states will be used for login and signup
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

    const navigation = useNavigate()
    const userLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({username, password})
            setUser(user)
            setUsername('')
            setPassword('')

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            navigation('/')
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
                    <Login
                    handleDisplay={{username: username, password: password}}
                    handleActions={{userLogin: userLogin, username: setUsername, password: setPassword}} />
                } />
                <Route path="/signup" element={
                    <Signup/>
                } />
                <Route path ="/feed" element={
                    <Feed user={user} />
                }
                />
                <Route path ="/profile" element={
                    <Profile/>
                }
                />
                <Route path="*" element={<UnknownEndpoint />} />
            </Routes>
        </BrowserRouter>
    </>
    )
}

export default App
