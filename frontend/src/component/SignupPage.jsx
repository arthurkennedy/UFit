function SignupPage({ username, password, handleUserLogin, handleSetUsername, handleSetPassword }) {

    return (
      <div className="comp-container">
        <div className="inner-container">
          <h2>User Login</h2>
          <form onSubmit={handleUserLogin}>
            <div>
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => handleSetUsername(target.value)}
                placeholder="Username"
              />
            </div>
            <div>
              
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => handleSetPassword(target.value)}
                placeholder="Password"
              />
            </div>
            <button type="submit">LOGIN</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default SignupPage