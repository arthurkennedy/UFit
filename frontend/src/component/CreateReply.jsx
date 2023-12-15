import {useState} from "react"
import {EditorState, convertToRaw} from "draft-js"
import entryService from "../services/entry.jsx"
import {Editor} from "react-draft-wysiwyg"
import {useDispatch, useSelector} from "react-redux";
import {addReply} from '../slices/entrySlice.js'

const CreateReply = ({entryId, updateReplies}) => {

	const [editor, setEditor] = useState(() => EditorState.createEmpty());
	const user = useSelector((state) => state.user)
	const token = useSelector(state => state.user.token)
	const dispatch = useDispatch()


	const handleSubmit = async (event) => {
		event.preventDefault()

		const response = await entryService.addReply({
			id: entryId,
			content: JSON.stringify(convertToRaw(editor.getCurrentContent()) ),
			user: user.user.id

		}, token)
		setEditor(() => EditorState.createEmpty());
		console.log("res", response);
		updateReplies(response);
	}
	
	return (
		<>
			<details>
				<summary style={{textAlign: 'right', color: "white", fontWeight: "bold"}} >💬 Reply </summary>
				<div className="create-entry-box">
					<form onSubmit={handleSubmit}>
						<Editor
							toolbar={{
								options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'emoji'],
								inline: {inDropdown: true},
								list: {inDropdown: true},
								textAlign: {inDropdown: true},
								link: {inDropdown: true},
								history: {inDropdown: true},
							}}
							editorState={editor}
							onEditorStateChange={setEditor}
						/>
						<br/>

						<button type="submit">Post!</button>
					</form>
				</div>
			</details>
		</>
	)
}

export default CreateReply