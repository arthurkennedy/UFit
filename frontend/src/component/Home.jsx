/* This home page will show user info when logged in 
and act as a welcome page when logged out */

function Home({user}) {
    console.log("wowking:")
    const userLogout = () => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
        console.log("should reload")
    }

    return (
        <>
            {user ? (
                <div className="comp-container">
                    <div>{user.username} is logged in</div>
                    <button onClick={()=> userLogout()} >Logout</button>
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
    );
  };
  
  export default Home