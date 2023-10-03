function LoginPage({ username, password, handleUserLogin, handleSetUsername, handleSetPassword }) {

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleUserLogin}>
        <div>
          username:
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => handleSetUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => handleSetPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginPage