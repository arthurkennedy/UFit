import {useEffect} from 'react'
import {Routes, Route} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

/*import components*/
import NavBar from './component/NavBar.jsx'
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import Home from './component/Home'
import UnknownEndpoint from './component/UnknownEndpoint.jsx'
import Feed from "./component/Feed.jsx"
import Profile from "./component/Profile.jsx"
import {initializeUser} from "./slices/userSlice.js"

const App = () => {
	const dispatch = useDispatch()

	const user = useSelector((state) => state.user.user)
	// Initialize the user when the App mounts
	useEffect(() => {
		dispatch(initializeUser())
	}, [dispatch])

	return (
		<>
			<a className="app-name" href="/">
				<h1>U-FIT</h1>
			</a>
			<>
				<NavBar/>
			</>
			<Routes>
				{user ? (
					<Route path="/" element={<Profile/>}/>
				) : (
					<Route path="/" element={<Home/>}/>
				)}
				<Route path="/login" element={
					<Login />
				}/>
				<Route path="/signup" element={
					<Signup/>
				}/>
				<Route path="/feed" element={
					<Feed />
				}/>
				<Route path="*" element={<UnknownEndpoint/>}/>
			</Routes>
		</>
	)
}

export default App
