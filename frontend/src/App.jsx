import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import loginService from './services/login'

/*import components*/
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import Home from './component/Home'
import UnknownEndpoint from './component/UnknownEndpoint.jsx'

const App = () => {

    //username and password states will be used for login and signup
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    
    const [user, setUser] = useState(null)

    //states for signup
    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [age, setAge] = useState(1)
    const [weight, setWeight] = useState(1)

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
            window.location.href = "/"
        } catch (exception) {
            console.log("error with user login. invalid credentials.")
        }
    }

    const userSignup = async (event) => {
        event.preventDefault()

        /* code here.... */
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
                    <Signup
                    handleDisplay={{
                        username: username, password: password, firstname: firstname,
                        lastname: lastname, age: age, weight: weight
                    }}
                    handleActions={{
                        userSignup: userSignup, username: setUsername, password: setPassword,
                        firstname: setFirstName, lastname: setLastName, age: setAge, weight: setWeight
                    }} />
                } />
                <Route path="*" element={<UnknownEndpoint />} />
            </Routes>
        </BrowserRouter>
    </>
    )
}

/* <username={username} password={password}/> */

export default App
