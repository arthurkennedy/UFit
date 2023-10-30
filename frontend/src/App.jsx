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
import RewardStore from "./component/rewardStore.jsx"
import EditTeam from "./component/EditTeam.jsx";
import notifCenter from "./component/notif.jsx";

const App = () => {

	const user = useSelector((state) => state.user.user)

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
				<Route path="/store" element={
					<RewardStore />
				}/>
				<Route path="/teams" element={
					<MyTeams />
				}/>
				<Route path="/notif" element={
					notifCenter()

				}/>
				<Route path="/admin/teams/:teamId" element={<EditTeam/>} />
				<Route path="*" element={<UnknownEndpoint/>}/>
			</Routes>
		</>
	)
}

export default App
