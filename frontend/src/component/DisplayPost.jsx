import {convertFromRaw, EditorState, Editor } from 'draft-js'

const DisplayPost = ({content}) => {
	const contentState = convertFromRaw(JSON.parse(content))
	const editorState = EditorState.createWithContent(contentState)
	return (
		<div className="post">
			<Editor editorState={editorState} readOnly />
		</div>
	)
}

export default DisplayPost