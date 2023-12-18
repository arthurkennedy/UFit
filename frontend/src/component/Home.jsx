/* This home page will show user info when logged in 
and act as a welcome page when logged out */

import Login from "./Login.jsx";

const Home = () => {
    return (
        <>
            <div className="comp-container">
                <h2>A web app for building healthy habits with friends.</h2>
                <Login />
            </div>

        </>
    )
}

export default Home
