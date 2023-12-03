import profile from "../assets/profile.jpg"
import {useEffect} from "react"
import {useState} from "react";
import DisplayEntry from "./DisplayEntry.jsx"
import {useDispatch, useSelector} from "react-redux";
import {fetchEntries} from '../slices/entrySlice.js'

import CreateReply from "./CreateReply.jsx";

const LikeButton = () =>{

	/*
	* This function is to add "likes" to the entry displayed.
	* We will pull this from a persistent value later.
	* */
	const [likes, setLikes] = useState(0) //How many likes does the post have?
	const [liked, setLiked] = useState(false) //Did the user like this before (LikedPost attribute)?

	const updateEntryStatus = () =>{
		//This code will assign the current values
		/*
		* TODO Add like attribute to entry object for LikeButton to pull from
		*  TODO Add likedPosts to User, prevent duplicate likes on a given post
		* */
	}
	const addLike = () => {
		// this will add another like to the entry object.
		//Basic like toggle button
		if(liked===false){
			setLikes(likes+1)
			setLiked(true)
		}else if(liked===true){
			setLikes(likes-1)
			setLiked(false)
		}
	}
	return(
		<>
			<button className="likeBtn" onClick={addLike}>👍{likes}</button>
		</>
	)
}
const CommentWizard = () =>{

	/*
	* This function is to add "likes" to the entry displayed.
	* We will pull this from a persistent value later.
	* */
	//const [likes, setLikes] = useState(0) //How many likes does the post have?
//	const [liked, setLiked] = useState(false) //Did the user like this before (LikedPost attribute)?

	const updateEntryStatus = () =>{
		//This code will assign the current values
		/*
		* TODO Add like attribute to entry object for LikeButton to pull from
		*  TODO Add likedPosts to User, prevent duplicate likes on a given post
		* */
	}

	return(
		<>
			<details>
				<summary>💬 Reply..</summary>
				<CreateReply></CreateReply>
			</details>
		</>
	)
}

const EntryList = () => {
	const entries = useSelector((state) => state.entries.entries);
	const token = useSelector((state) => state.user.token)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchEntries(token))
	}, [dispatch, token])
	
console.log(3,entries);
	return (<div className="main-container">
		{entries.map((entry) => <div key={entry._id} className="feedBox">

			<div className={"messageBox"}>
				<div className="author">
					<div className="profileImage" style={{
						backgroundImage: `url(${entry.user.picture ? entry.user.picture : profile})`
					}}>
					</div>
					{entry.user.username}
				</div>
				{
					(entry.content != "Test" && entry.content != "great job") && <DisplayEntry content={entry.content}/>
				}
				<LikeButton/>
			</div>
			<div style={{display:"flex", justifyContent: "end", color: "white", fontWeight: "bold"}}>
			<CommentWizard />
			</div>
			

			
		</div>)}
	</div>)
}

export default EntryList
