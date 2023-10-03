function Home({user}) {

    const userLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
    }

    return (
        <>
            {user ? (
                <div>
                    <div>{user.username} is logged in</div>
                    <a onClick={()=> userLogout()}  href="auth-link-button">Logout</a>
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