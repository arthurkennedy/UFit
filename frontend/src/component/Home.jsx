function Home({ username, password, handleUserLogin, handleSetUsername, handleSetPassword }) {

    return (
      <div className="comp-container">
        <a href="/login">LOG In</a>
        <a href="/signup">Sign Up</a>
      </div>
    );
  };
  
  export default Home