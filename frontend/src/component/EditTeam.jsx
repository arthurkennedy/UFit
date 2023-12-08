import { useSelector} from 'react-redux'

import {useParams} from "react-router-dom";



const onSubmit = (e) => {
    e.preventDefault()
}
const EditTeam = () => {
    const {teamId} = useParams()
    const user = useSelector(state => state.user.user)
    const team = user.teams.find(team => team.id === teamId)
    function handleChange(e, age) {
        team.name=age
    }

    return(
        <>
            <form onSubmit={onSubmit}>
                <div className="row user-details">
                    <div>
                        <label>
                            <p>CLEAN THIS</p>
                            <b>Team Name: </b>
                            <input
                                type="text"
                                min="1"
                                max="120"
                             //   value={newUserState.age}
                                name="age"
                                onChange={e => {
                                           handleChange(e, 'weight')
                                }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            <b>Edit Members</b>
                            <input
                                type="checkbox"
                                min="1"
                                max="400"
                              //  value={newUserState.weight}
                                name="weight"
                                onChange={e => {
                                    handleChange(e, 'weight')
                                }}
                            />
                        </label>
                    </div>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </>

    )
}

export default EditTeam