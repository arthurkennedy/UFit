import {convertFromRaw, EditorState, Editor } from 'draft-js'
import {useEffect, useState} from "react";
import CreateReply from "./CreateReply.jsx";
import profile from "../assets/profile.jpg";
import entryService from "../services/entry.jsx"
import {useSelector} from "react-redux";

const LikeButton = () => {

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
		if(liked===false) {
			setLikes(likes+1)
			setLiked(true)
		} else if(liked===true) {
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

const DisplayEntry = ({entry, indentLevel}) => {
	const [replies, setReplies] = useState([])
	const [isShowReplies, setIsShowReplies] = useState(false)
	const token = useSelector(state => state.user.token)

	const [localEntry, setLocalEntry] = useState(entry)


	const replyCount = replies.length === 0 ? localEntry.replies.length : replies.length;

	const contentState = convertFromRaw(JSON.parse(localEntry.content))
	const editorState = EditorState.createWithContent(contentState)
	const toggleShowReplies = async () => {
		if (!isShowReplies && replies.length === 0) {
			await fetchReplies(localEntry.id);
		}
		setIsShowReplies(!isShowReplies);
	}

	const updateReplies = (reply) => {
		setReplies([reply, ...replies])
	}

	const fetchReplies = async (entryId) => {
		try {
			// Assuming 'entryService' has a method 'getReplies'
			const replies = await entryService.getReplies(entryId, token)
			setReplies(replies)
		} catch (error) {
			console.log("error fetching replies")
		}
	}
	const calculatePaddingStyle = (indentLevel) => {
		return {
			marginLeft: `${indentLevel * 30}px`,
			borderLeft: `10px solid black`
		}
	}


	return (
		<>
			<div className={"messageBox"} style={calculatePaddingStyle(indentLevel)}>
				<div className="author">
					<div className="profileImage" style={{
						backgroundImage: `url(${localEntry.user.picture ? localEntry.user.picture : profile})`
					}}>
					</div>
					{localEntry.user.username}
				</div>
				<div className="entry">
					<Editor editorState={editorState} readOnly />
				</div>
				<LikeButton/>
				{replyCount > 0 && <button onClick={() => toggleShowReplies()}>
					{isShowReplies ? "Hide Replies" : `Show Replies (${replyCount})`}
				</button>}
			</div>
			<div style={calculatePaddingStyle(indentLevel)}>
				{<CreateReply entryId={localEntry.id} updateReplies={updateReplies} />}
			</div>
			{isShowReplies && replies.map(reply => (
				<div key={reply.id}>
					<DisplayEntry key={reply.id} entry={reply} indentLevel={indentLevel + 1} />
				</div>
			))}
		</>
	)
}

export default DisplayEntry