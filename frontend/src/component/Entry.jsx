import { useState } from 'react';
import DisplayEntry from './DisplayEntry.jsx';
import CreateReply from './CreateReply.jsx';

const Entry = ({ entry, depth = 0 }) => {
	const [showReplies, setShowReplies] = useState(false)

	const toggleReplies = () => {
		setShowReplies(!showReplies)
	}

	return (
		<div className="entry-container">
			<DisplayEntry content={entry.content} />
			<button onClick={toggleReplies}>{showReplies ? 'Hide Replies' : 'Show Replies'}</button>
			{showReplies && (
				<>
					{entry.replies.map(reply => (
						<DisplayEntry key={reply.id} content={reply.content} />
					))}
					<CreateReply entryId={entry.id} />
				</>
			)}
		</div>
	);
};

export default Entry