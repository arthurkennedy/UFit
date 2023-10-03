function Home({ username, password, handleUserLogin, handleSetUsername, handleSetPassword }) {

    return (
      <div className="comp-container">
        <h2>A web app for building healthy habits with friends.</h2>
        <p>
            <a className="auth-link-button" href="/login">LOG In</a>
        </p>
        <p>
            <a className="auth-link-button" href="/signup">Sign Up</a>
        </p>
      </div>
    );
  };
  
  export default Home