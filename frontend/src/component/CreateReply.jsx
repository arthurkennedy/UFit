import {useState} from "react"
import {EditorState, convertToRaw} from "draft-js"
import entryService from "../services/entry.jsx"
import {Editor} from "react-draft-wysiwyg"
import {useDispatch, useSelector} from "react-redux";
import {addEntry} from '../slices/entrySlice.js'

const CreateReply = () => {
	/**
	 * Form info data can transfer as CSV or JSON
	 * It would include posting user, generated message ID, subject line, and body
	 * Wen user hits submit, this widget would package up message and metadata into a form
	 * that is able to be sent between the database and people's computers all in one place
	 * so no info is lost
	 */

	const [editor, setEditor] = useState(() => EditorState.createEmpty());
	const user = useSelector((state) => state.user)
//	const token = useSelector(state => state.user.token)
//	const dispatch = useDispatch()


	const handleSubmit = async (event) => {
		event.preventDefault()

		console.log("??", convertToRaw(editor.getCurrentContent()).blocks[0].text)

		const response = await  fetch("http://localhost:3001/api/entry/reply",  {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			headers: {
			  "Content-Type": "application/json",
			  // 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({
				id: "655aa5f8b47082c19e4b5585",
				content: convertToRaw(editor.getCurrentContent()).blocks[0].text,
				user: user.user.id

			})// body data type must match "Content-Type" header
		  }); 
		/*
		TODO Reply logic here..

    const contentState = editor.getCurrentContent()
    const rawContent = JSON.stringify(convertToRaw(contentState))
		const entry = await entryService.post({"content": rawContent}, token)
		dispatch(addEntry(entry))
    setEditor(() => EditorState.createEmpty())
		 */
	}
	
	return (
		<>
			<div className="comp-container">
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
					{/*<p>Submit button in development</p>*/}
				</form>
			</div>
		</>
	)
}

export default CreateReply