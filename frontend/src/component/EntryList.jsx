import profile from "../assets/profile.jpg"
import {useEffect} from "react"
import DisplayEntry from "./DisplayEntry.jsx"
import {useDispatch, useSelector} from "react-redux";
import {fetchEntries} from '../slices/entrySlice.js'

const EntryList = () => {
	const entries = useSelector((state) => state.entries.entries)
	const dispatch = useDispatch()
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		const token = JSON.parse(loggedUserJSON).token
		dispatch(fetchEntries(token))
	}, [dispatch])

	return (<div className="feedContainer">
		{entries.map((entry) => <div key={entry._id} className="feedBox">
			<div className="author">
				<div className="profileImage" style={{
					backgroundImage: `url(${profile})`
				}}>
				</div>
				{entry.user.username}
			</div>
			<DisplayEntry content={entry.content}/>
		</div>)}
	</div>)
}

export default EntryList
