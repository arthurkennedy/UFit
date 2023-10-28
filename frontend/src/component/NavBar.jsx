import {Link} from "react-router-dom"
import {useSelector} from "react-redux";


const NavBar = () => {
    const user = useSelector((state) => state.user.user)
    if(user){
        return(
            <div className={"Navi"}>
                <div>

                </div>
                <div className={"Home"}>
                    <Link to={"/"} class="uButton" >Homepage</Link><Link class="uButton" to={"/Feed"}>Feed</Link>
                    <Link class="uButton" to={"/teams"}>My Teams</Link><Link class="uButton" to={"/teams"}>Teams I Manage</Link>

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
        )
    } else {
        return null;
    }
}

export default NavBar