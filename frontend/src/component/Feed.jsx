import "../style/feed.css"
import CreateEntry from "./CreateEntry.jsx";
import EntryList from "./EntryList.jsx";

/* This user feed page will only be visible if you logged in.*/

// Feed uses widgets above.
const Feed = () => {
    return (
        <div className="page-contents-container">
            <h1> Feed</h1>
            <h3>Create New Post</h3>
            <br/>
            <CreateEntry/>
            <br/>
            <div className="container">
                <h3>Users you followed will post here..</h3>
                <EntryList/>
            </div>
        </div>
    );
};

export default Feed