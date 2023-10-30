import {useState} from "react"
import {EditorState, convertToRaw} from "draft-js"
import entryService from "../services/entry.jsx"
import {Editor} from "react-draft-wysiwyg"

const CreatePost = () => {
	/**
	 * Form info data can transfer as CSV or JSON
	 * It would include posting user, generated message ID, subject line, and body
	 * Wen user hits submit, this widget would package up message and metadata into a form
	 * that is able to be sent between the database and people's computers all in one place
	 * so no info is lost
	 */

	const [editor, setEditor] = useState(() => EditorState.createEmpty())

	const handleSubmit = async (event) => {
		event.preventDefault()
    const contentState = editor.getCurrentContent()
    const rawContent = JSON.stringify(convertToRaw(contentState))
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		const token = JSON.parse(loggedUserJSON).token
		const entry = await entryService.post({"content": rawContent}, token)
    setEditor(() => EditorState.createEmpty())
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
				</form>
			</div>
		</>
	)
}

export default CreatePost