function LoginPage({ username, password, handleUserLogin, handleActions}) {

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
              onChange={({ target }) => handleActions.username(target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => handleActions.password(target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage