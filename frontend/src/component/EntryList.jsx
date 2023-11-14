import profile from "../assets/profile.jpg"
import {useEffect} from "react"
import DisplayEntry from "./DisplayEntry.jsx"
import {useDispatch, useSelector} from "react-redux";
import {fetchEntries} from '../slices/entrySlice.js'

const EntryList = () => {
	const entries = useSelector((state) => state.entries.entries)
	const token = useSelector((state) => state.user.token)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchEntries(token))
	}, [dispatch, token])

	return (<div className="main-container">
		{entries.map((entry) => <div key={entry._id} className="feedBox">
			<div className="author">
				<div className="profileImage" style={{
					backgroundImage: `url(${entry.user.picture ? entry.user.picture : profile})`
				}}>
				</div>
				{entry.user.username}
			</div>
			<DisplayEntry content={entry.content}/>
		</div>)}
	</div>)
}

export default EntryList
