// eslint-disable-next-line no-unused-vars
import {Routes, Navigate, Route} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

//import logo 
import logoImg from "./assets/uFitLogo3.ico"

/*import components*/
import NavBar from './component/NavBar.jsx'
import Login from './component/Login.jsx'
import Signup from './component/Signup.jsx'
import Home from './component/Home'
import UnknownEndpoint from './component/UnknownEndpoint.jsx'
import Feed from "./component/Feed.jsx"
import Profile from "./component/Profile.jsx"
import MyTeams from "./component/MyTeams.jsx"
import RewardStore from "./component/RewardStore.jsx"
import TeamPage from "./component/TeamPage.jsx";
import NotificationCenter from "./component/NotificationCenter.jsx"
import ProfileSettings from "./component/ProfileSettings.jsx"

import {validateUserToken} from "./slices/userSlice.js"
import {useEffect} from "react"
import WorkOut from "./component/WorkOut.jsx";



const App = () => {

	const user = useSelector((state) => state.user.user)
	const token = useSelector((state) => state.user.token)
	const dispatch = useDispatch()

	useEffect(() => {
		if(token) {
			dispatch(validateUserToken(token))
		}
	}, [token, dispatch])

	return (
		<>
			<a className="app-name" href="/">
				<img src={logoImg} alt="U-Fit logo image" />
				<h1>U-FIT</h1>
			</a>

			<>
				<NavBar/>
			</>

			<Routes>
				<Route path="/" element={user ? <Profile/> : <Home/>}/>

				<Route path="/login" element={user ? <Navigate to="/"/> : <Login/>}/>

				<Route path="/signup" element={user ? <Navigate to="/"/> : <Signup/>}/>

				<Route path="/profile-settings" element={!user ? <Navigate to="/"/> : <ProfileSettings/>}/>

				<Route path="/feed" element={!user ? <Navigate to="/"/> : <Feed/>}/>

				<Route path="/store" element={!user ? <Navigate to="/"/> : <RewardStore/>}/>

				<Route path="/teams" element={!user ? <Navigate to="/"/> : <MyTeams/>}/>

				<Route path="/notif" element={!user ? <Navigate to="/"/> : <NotificationCenter/> }/>

				<Route path="/admin/teams/:teamId" element={!user ? <Navigate to="/"/> : <TeamPage/>}/>

				<Route path="/workout" element={!user ? <Navigate to="/"/> : <WorkOut/>}/>


				<Route path="*" element={<UnknownEndpoint/>}/>
			</Routes>
		</>
	)
}

export default App
