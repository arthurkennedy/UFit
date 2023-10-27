/* This home page will show user info when logged in 
and act as a welcome page when logged out */

const Home = () => {
    return (
        <>
            <div className="comp-container">
                <h2>A web app for building healthy habits with friends.</h2>
                <p>
                    <a className="auth-link-button" href="/login">LOG In</a>
                </p>
                <p>
                    <a className="auth-link-button" href="/signup">Sign Up</a>
                </p>
            </div>

        </>
    )
}

export default Home
