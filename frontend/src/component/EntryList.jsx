import profile from "../assets/profile.jpg"
import {useEffect} from "react"
import DisplayEntry from "./DisplayEntry.jsx"
import {useDispatch, useSelector} from "react-redux";
import {fetchEntries} from '../slices/entrySlice.js'




const EntryList = () => {
	const entries = useSelector((state) => state.entries.entries);
	const token = useSelector((state) => state.user.token)
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(fetchEntries(token))
	}, [dispatch, token])

	
	return (<div className="main-container">
		{entries.map((entry) =>
			(
				<div key={entry.id} className="feedBox">
					<DisplayEntry entry={entry} indentLevel={0} />
				</div>
			)
		)}
	</div>)
}


export default EntryList
