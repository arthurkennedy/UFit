import {convertFromRaw, EditorState, Editor } from 'draft-js'
import {useState} from "react";
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
			<button onClick={addLike}>👍{likes}</button>
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

const DisplayEntry = ({content}) => {
	const contentState = convertFromRaw(JSON.parse(content))
	const editorState = EditorState.createWithContent(contentState)
	return (
		<div className="entry">
			<Editor editorState={editorState} readOnly />
			<LikeButton></LikeButton><CommentWizard></CommentWizard>
		</div>
	)
}

export default DisplayEntry