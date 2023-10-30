import "../style/feed.css"
import profile from "../assets/profile.jpg"
import entryService from "../services/entry"
import {useState} from "react"
import {EditorState, convertToRaw} from "draft-js"
import {Editor} from "react-draft-wysiwyg"

/* This user feed page will only be visible if you logged in.*/

// CreatePost will access the database and contribute to a user's post

// TODO: User integration
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
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        const user = JSON.parse(loggedUserJSON)
        await entryService.post({"content": entryText}, user.token)

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

const FetchPost = () => {
    const data = [
        {
            username: 'John Doe',
            likes: 5,
            comment: "I did 3 sets today",
            replies: [
                {
                    username: 'Jane Doe',
                    comment: 'Test comment'
                },
                {
                    username: 'Jane Doe',
                    comment: 'Test comment'
                },
            ]
        },
        {
            username: 'Chris Doe',
            likes: 2,
            replies: []
        }
    ]

    return (
        <div className="feedContainer">
            {
                data.map((item) =>
                    <div className="feedBox">
                        <div className="author">
                            <div className="profileImage" style={{
                                backgroundImage: `url(${profile})`
                            }}>
                            </div>

                            {item.username}
                        </div>
                        <div className="post">
                            <div>
                                {
                                    item.comment

                                }
                            </div>
                            <div>
                                likes: {
                                item.likes
                            }
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

// Feed uses widgets above.
const Feed = () => {
    return (
        <div className="page-contents-container">
            <h1> Feed</h1>
            <h3>Create New Post</h3>
            <br/>
            <CreatePost/>
            <br/>
            <div className="container">
                <h3>Users you followed will post here..</h3>
                <FetchPost/>
            </div>
        </div>
    );
};

export default Feed