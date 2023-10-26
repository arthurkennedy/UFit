import { useSelector, useDispatch } from 'react-redux'
import { logOutUser } from '../slices/userSlice' // Adjust this import to your folder structure


import myImage from "../assets/profile.jpg"
import "../style/profile.css"

export default function Profile () {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const myProfile = {
        username: user ? user.username : "",
        name: user ? user.first_name + " " + user.last_name: "",
        bio: "I am new to bodybuilding",
        height: user ? user.height : "",
        weight: user ? user.weight : "",
        bmi: "16%"
    }

    const userLogout = () => {
        dispatch(logOutUser()); // This will update the Redux state
        window.localStorage.removeItem('loggedUser') // Remove the user from local storage
    }

    return (
        <div className="profile row">
            <div className="left">
            <img src={myImage} width="100"/>
            <div className="box">
                { myProfile.username }
            </div>
            </div>
            <div className="right">
                <div className="box">
                    <div className="row">
                        <div className="label">NAME:</div>
                        <div>{myProfile.name}</div>
                    </div>
                    <div className="row">
                        <div className="label">BIO:</div>
                        <div>{myProfile.bio}</div>
                    </div>
                    <div className="row">
                        <div className="label">HEIGHT:</div>
                        <div>{myProfile.height}</div>
                    </div>
                    <div className="row">
                        <div className="label">WEIGHT:</div>
                        <div>{myProfile.weight}</div>
                    </div>
                    <div className="row">
                        <div className="label">BMI:</div>
                        <div>{myProfile.bmi}</div>
                    </div>
                </div>
            </div>
            <div>
                <button onClick={userLogout}>Log Out</button>
            </div>`
        </div>
    )
}