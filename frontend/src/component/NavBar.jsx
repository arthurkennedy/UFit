import {Link, useLocation} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux";
import {logOutUser} from '../slices/userSlice' // Adjust this import to your folder structure


const NavBar = () => {
    
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    const location = useLocation();

    if(user){

        const userLogout = () => {
            dispatch(logOutUser()); // This will update the Redux state
        }

        return(

            <div className="navi">
                <div>
                    <ul>

                        <li className={location.pathname === "/"? 'active': 'left'}> <Link to={"/"} >Homepage</Link> </li>
                        <li className={location.pathname === "/Feed"? 'active': 'left'}><Link to={"/Feed"}>Feed</Link></li>
                        <li className={location.pathname.includes("/teams")? 'active': 'left'}><Link to={"/teams"}>My Teams</Link></li>
                        <li className={location.pathname === "/store"? 'active': 'left'}><Link to={"/store"}>Rewards</Link></li>
                        <li className={location.pathname === "/notif"? 'active': 'left'}><Link to={"/notif"}>My Notifications</Link></li>

                    </ul>
                </div>
                <div className="right">
                    <button className="logout-button" onClick={userLogout}>Logout</button>
                </div>
            </div>

        )
    } else {
        return null;
    }
}

export default NavBar