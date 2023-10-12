/* This home page will show user info when logged in 
and act as a welcome page when logged out */

import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from '../slices/userSlice'; // Adjust this import to your folder structure

const Home = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    console.log(user)
    const userLogout = () => {
        dispatch(logOutUser()); // This will update the Redux state
        window.localStorage.removeItem('loggedUser') // Remove the user from local storage
    }

    return (
        <>
            {user ? (
                <div className="comp-container">
                    <div>{user.username} is logged in</div>
                    <button onClick={userLogout}>Logout</button>
                </div>
            ) : (
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
            )}
        </>
    )
}

export default Home
