const SignupPage = ({ handleDisplay, handleActions}) => {

    return (
      <div className="comp-container">
        <div className="inner-container">
          <h2>User Signup</h2>
          <form onSubmit={handleActions.userSignup}>
            <div>
                <label>
                    <b>Username: </b>
                    <input
                        type="text"
                        value={handleDisplay.username}
                        name="Username"
                        onChange={({ target }) => handleActions.username(target.value)}
                        placeholder="Username"
                    />
                </label>
            </div>
            <div>
                <label>
                    <b>Password: </b>
                    <input
                        type="password"
                        value={handleDisplay.password}
                        name="Password"
                        onChange={({ target }) => handleActions.password(target.value)}
                        placeholder="Password"
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>First name: </b>
                    <input
                        type="text"
                        value={handleDisplay.firstName}
                        name="first-name"
                        onChange={({ target }) => handleActions.firstname(target.value)}
                        placeholder="First Name..."
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>Last name: </b>
                    <input
                        type="text"
                        value={handleDisplay.lastName}
                        name="last-name"
                        onChange={({ target }) => handleActions.lastname(target.value)}
                        placeholder="Last Name..."
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>Age: </b>
                    <input
                        type="number"
                        min="1"
                        max="120"
                        value={handleDisplay.age}
                        name="age"
                        onChange={({ target }) => handleActions.age(target.value)}
                        placeholder="Age..."
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>Weight: </b>
                    <input
                        type="number"
                        min="1"
                        max="120"
                        value={handleDisplay.weight}
                        name="age"
                        onChange={({ target }) => handleActions.weight(target.value)}
                        placeholder="Weight..."
                    />
                </label>
            </div>

            <button type="submit">SignUp</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default SignupPage