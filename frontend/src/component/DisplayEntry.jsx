import {convertFromRaw, EditorState, Editor } from 'draft-js'
import {useState} from "react";
import CreateReply from "./CreateReply.jsx";
import profile from "../assets/profile.jpg";
import entryService from "../services/entry.jsx"
import {useSelector} from "react-redux";


const DisplayEntry = ({entry, indentLevel}) => {
	const [replies, setReplies] = useState([])
	const [isShowReplies, setIsShowReplies] = useState(false)
	const token = useSelector(state => state.user.token)
	const user = useSelector(state => state.user.user)

	const [liked, setLiked] = useState(entry.likes.includes(user.id))
	const [likes, setLikes] = useState(entry.likes.length)


	const replyCount = replies.length === 0 ? entry.replies.length : replies.length;

	const contentState = convertFromRaw(JSON.parse(entry.content))
	const editorState = EditorState.createWithContent(contentState)
	const toggleShowReplies = async () => {
		if (!isShowReplies && replies.length === 0) {
			await fetchReplies(entry.id);
		}
		setIsShowReplies(!isShowReplies);
	}

	const toggleLike = async () => {
		try {
			entry = await entryService.toggleLike(entry.id, token)
			setLiked(!liked)
			setLikes(entry.likes.length)
		} catch (e) {
			console.log("error toggling like")
		}
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
	const calculateParentPaddingStyle = (indentLevel) => {
		return {
			//Applies to main post and replies, hence the weird black bar
			marginLeft: `${indentLevel * 30}px`,
			borderLeft: `10px solid black`
		}
	}
	const calculateChildPaddingStyle = (indentLevel) => {
		return {
			marginLeft: `${indentLevel * 30}px`,
			//borderLeft: `10px solid black`
		}
	}


	return (
		<>
			<div className={"messageBox"} style={calculateParentPaddingStyle(indentLevel)}>
				<div className="author">
					<div className="profileImage" style={{
						backgroundImage: `url(${entry.user.picture ? entry.user.picture : profile})`
					}}>
					</div>
					{entry.user.username}
				</div>
				<div className="entry">
					<Editor editorState={editorState} readOnly />
				</div>
				<button className="likeBtn" onClick={toggleLike}>👍{likes}</button>
				{replyCount > 0 && <button onClick={() => toggleShowReplies()}>
					{isShowReplies ? "Hide Replies" : `Show Replies (${replyCount})`}
				</button>}
			</div>
			<div style={calculateChildPaddingStyle(indentLevel)}>
				{<CreateReply entryId={entry.id} updateReplies={updateReplies} />}
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