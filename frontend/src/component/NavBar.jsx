import {Link} from "react-router-dom"

const NavBar = ({user}) => {

    if(user){
        return(
            <div className={"Navi"}>
                <div>

                </div>
                <div className={"Home"}>
                    <Link to={"/"}>Homepage</Link>
                </div>
                <div className={"Feed" }>
                    {
                        //Insure user is logged in before pulling in feed.
                        //If user not logged in, let's make it that this links them to LOGIN like /home
                    }
                    <Link to={"/Feed"}>Feed</Link>
                </div>
            </div>
        )
    }else {
        return null;
    }
}

export default NavBar