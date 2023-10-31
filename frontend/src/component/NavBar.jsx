import {Link} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux";
import {logOutUser} from '../slices/userSlice' // Adjust this import to your folder structure


const NavBar = () => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    if(user){

        const userLogout = () => {
            dispatch(logOutUser()); // This will update the Redux state
        }

        return(

            <div className="navi">
                <div>
                    <ul>

                        <li className="left"> <Link to={"/"} >Homepage</Link> </li>
                        <li className="left"><Link to={"/Feed"}>Feed</Link></li>
                        <li className="left"><Link to={"/teams"}>My Teams</Link></li>
                        <li className="left"><Link to={"/store"}>u-fit rewards</Link></li>
                        <li className="left"><Link to={"/notif"}>My Notifications</Link></li>

                    </ul>
                </div>
                <div className="right">
                    <button className="logout-button" onClick={userLogout}>Logout</button>
                </div>
            </div>

            /*
            <div className={"Navi"}>


                <div>

                </div>
                <div className={"Home"}>
                    <Link to={"/"} className="uButton" >Homepage</Link>
                    <Link className="uButton" to={"/Feed"}>Feed</Link>
                    <Link className="uButton" to={"/teams"}>My Teams</Link>
                    <Link className="uButton" to={"/store"}>u-fit rewards</Link>
                    <Link className="uButton" to={"/notif"}>My Notifications</Link>

                </div>
                <div className={"Feed" }>
                    {
                        //Insure user is logged in before pulling in feed.
                        //If user not logged in, let's make it that this links them to LOGIN like /home
                    }
                </div>
                <div>
                    <br/>
                    {
                        //Spacer
                    }
                    <br/>
                </div>
            </div>
            */
        )
    } else {
        return null;
    }
}

export default NavBar