import myImage from "../assets/profile.jpg"
import "../style/profile.css"

export default function Profile () {

const myProfile = {
    username: "GregSmith",
    name: "Greg Smith",
    bio: "I am new to bodubuilding",
    height: "6'-1\"",
    weight: "215lbs",
    bmi: "16%"
}

    return <div className="profile row">
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

    </div>

}