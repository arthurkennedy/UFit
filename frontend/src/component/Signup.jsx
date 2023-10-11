


const Signup = ({ handleDisplay, handleActions}) => {

    const showErrorMessage = (id) => {
        document.getElementById(id).classList.remove("hide");
    }

    const hideErrorMessage = (id) => {
        document.getElementById(id).classList.add("hide");
    }

    const handleSubmit = (event) => {
        event.preventDefault() // stops submission

        let nameFormat = /^[a-zA-Z ]+$/ //only contain letters, numbers and spaces
        let mailformat = /\S+@\S+\.\S+/
        
        let isSubmit = true;

        if(handleDisplay.username.length < 3){
            console.log("invalid username");
            isSubmit = false;

            showErrorMessage("username-error");
        }else {
            hideErrorMessage("username-error");
        }

        //firstname validate
        let firstName = handleDisplay.firstname
        if(!nameFormat.test(firstName)){
            console.log("invalid firstname");
            isSubmit = false;

            showErrorMessage("firstname-error");
        }else {
            hideErrorMessage("firstname-error");
        }

        //lastname validate
        let lastName = handleDisplay.lastname
        if(!nameFormat.test(lastName)){
            console.log("invalid lastname");
            isSubmit = false;

            showErrorMessage("lastname-error");
        }else {
            hideErrorMessage("lastname-error");
        }

        //email validate
        if(!mailformat.test(handleDisplay.email)){
            console.log("invalid email");
            isSubmit = false;

            showErrorMessage("email-error");
        }else {
            hideErrorMessage("email-error");
        }
        
        //pasword validate
        if(handleDisplay.password.length < 3){
            console.log("invalid password");
            isSubmit = false;

            showErrorMessage("password-error");
        }else {
            hideErrorMessage("password-error");
        }
        
        if(isSubmit){
            handleActions.userSignup(event)
        }
    }

    return (
      <div className="comp-container">
        <div className="inner-container">
          <h2>User Signup</h2>
          <form onSubmit={handleSubmit}>
            <div>
                <label>
                    <b>Username: </b>

                    <div className="error-text hide" id="username-error">
                        Please enter a valid username. 
                        A valid username must be 3 characters or more.
                    </div>

                    <input
                        type="text"
                        value={handleDisplay.username}
                        name="Username"
                        onChange={({ target }) => {
                            handleActions.username(target.value)
                            hideErrorMessage("username-error")
                        }}
                        placeholder="Username"
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>First name: </b>

                    <div className="error-text hide" id="firstname-error">
                        Please enter a valid first name. 
                        A valid first name should only contain letters and spaces.
                    </div>

                    <input
                        type="text"
                        value={handleDisplay.firstname}
                        name="first-name"
                        onChange={({ target }) => {
                            handleActions.firstname(target.value)
                            hideErrorMessage("firstname-error")
                        }}
                        placeholder="First Name..."
                    />
                </label>
            </div>

            <div>
                <label>
                    <b>Last name: </b>

                    <div className="error-text hide" id="lastname-error">
                        Please enter a valid last name. 
                        A valid last name should only contain letters and spaces.
                    </div>

                    <input
                        type="text"
                        value={handleDisplay.lastname}
                        name="last-name"
                        onChange={({ target }) => {
                            handleActions.lastname(target.value)
                            hideErrorMessage("lastname-error")
                        }}
                        placeholder="Last Name..."
                    />
                </label>
            </div>

            <div>
              <label>
                    <b>Email: </b>

                    <div className="error-text hide" id="email-error">
                        Please enter your email address in format: yourname@example.com
                    </div>
                  
                    <input
                        type="test"
                        value={handleDisplay.email}
                        name="Email"
                        onChange={({ target }) => {
                            handleActions.email(target.value)
                            hideErrorMessage("email-error")
                        }}
                        placeholder="email..."
                    />
              </label>
            </div>

            <div>
                <label>
                    <b>Password: </b>

                    <div className="error-text hide" id="password-error">
                        Please enter a valid password. 
                        A valid password must be 3 characters or more.
                    </div>

                    <input
                        type="password"
                        value={handleDisplay.password}
                        name="Password"
                        onChange={({ target }) => {
                            handleActions.password(target.value)
                            hideErrorMessage("password-error")
                        }}
                        placeholder="Password"
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
                        max="400"
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
  
  export default Signup