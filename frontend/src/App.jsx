// eslint-disable-next-line no-unused-vars
import {Routes, Navigate, Route} from "react-router-dom"
import {useSelector} from "react-redux"

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
import EditTeam from "./component/EditTeam.jsx";
import NotificationCenter from "./component/NotificationCenter.jsx";

const App = () => {
	const user = useSelector((state) => state.user.user)

	return (<>
			<a className="app-name" href="/">
				<h1>U-FIT</h1>
			</a>
			<>
				<NavBar/>
			</>
			<Routes>
				<Route path="/" element={user ? <Profile/> : <Home/>}/>
				<Route path="/login" element={user ? <Navigate to="/"/> : <Login/>}/>
				<Route path="/signup" element={user ? <Navigate to="/"/> : <Signup/>}/>
				<Route path="/feed" element={!user ? <Navigate to="/"/> : <Feed/>}/>
				<Route path="/store" element={!user ? <Navigate to="/"/> : <RewardStore/>}/>
				<Route path="/teams" element={!user ? <Navigate to="/"/> : <MyTeams/>}/>
				<Route path="/notif" element={!user ? <Navigate to="/"/> : <NotificationCenter/>}/>
				<Route path="/admin/teams/:teamId" element={!user ? <Navigate to="/"/> : <EditTeam/>}/>
				<Route path="*" element={<UnknownEndpoint/>}/>
			</Routes>
		</>)
}

export default App
