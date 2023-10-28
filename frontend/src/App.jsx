import {useEffect} from 'react'

// eslint-disable-next-line no-unused-vars
import {Routes, Navigate, Route} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {initializeUser} from "./slices/userSlice.js"

/*import components*/
import NavBar from './component/NavBar.jsx'
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import Home from './component/Home'
import UnknownEndpoint from './component/UnknownEndpoint.jsx'
import Feed from "./component/Feed.jsx"
import Profile from "./component/Profile.jsx"
import Admin from "./component/Admin.jsx"
import TeamHub from "./component/TeamHub.jsx"
import EditTeam from "./component/EditTeam.jsx";

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
				<Route path="/teams" element={
					<TeamHub />
				}/>
				<Route path="/admin" element={
					<Admin />
				}/>
				<Route path="/admin/teams/:teamId" element={<EditTeam/>} />
				<Route path="*" element={<UnknownEndpoint/>}/>
			</Routes>
		</>
	)
}

export default App
