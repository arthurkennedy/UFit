import {convertFromRaw, EditorState, Editor } from 'draft-js'

const DisplayEntry = ({content}) => {
	const contentState = convertFromRaw(JSON.parse(content))
	const editorState = EditorState.createWithContent(contentState)
	return (
		<div className="entry">
			<Editor editorState={editorState} readOnly />
			<button>👍Like</button><button>💬Comment</button>
		</div>
	)
}

export default DisplayEntry