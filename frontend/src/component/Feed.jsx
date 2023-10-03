/* This user feed page will only be visible if you logged in.*/

// CreatePost will access the database and contribute to a user's post

// TODO: User integration
const CreatePost = () => {
    /**
     * Form info data can transfer as CSV or JSON
     * It would include posting user, generated message ID, subject line, and body
     * WHen user hits submit, this widget would package up message and metadata into a form
     * that is able to be sent between the database and people's computers all in one place
     * so no info is lost
     */

    return(
        <>
            <>
                <h3>Hello!</h3>
                <div className="comp-container">
                    {/*This will shoot the form to the database under the user's posts*/}
                    <form action="">
                        <br/>
                        <label htmlFor="">Title</label>
                        <br/>
                        <input
                            type="text" name="" id=""/> {/*TODO logic here*/}
                        <br/>
                        <label htmlFor="">Body</label>
                        <br/>
                        <textarea>

                        </textarea>
                        <br/>
                        <input type="submit" name="" id=""/>
                    </form>
                </div>
            </>
        </>
    );
};

const FetchPost = () => {
    return(
        <>
            <h3>Users you followed will post here..</h3>
        </>
    );
};

// Feed uses widgets above.
const Feed = () => {
    return(
        <>
        <>
            <h1> Feed</h1>
            <h3>Create New Post</h3>
            <br/>
            <>
                <CreatePost></CreatePost>
            </>
            <br/>
            <>
                <FetchPost></FetchPost>
            </>
        </>
    </>
    );
};

export default Feed