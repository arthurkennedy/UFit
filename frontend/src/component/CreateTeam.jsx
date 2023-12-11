import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import teamService from '../services/team'
import {addNewTeam} from '../slices/userSlice.js'

const CreateTeam = () => {
    const token = useSelector(state => state.user.token)
    const dispatch = useDispatch()
   

    const initialTeamState = {
        name: "",
        schedule: "DAILY",
        distrib: "MONTHLY",
        plan: "FREE",
        paid: 0,
        fee: 0,
    }

    const [newTeamState, setNewTeamState] = useState(initialTeamState)
    const [errors, setErrors] = useState({})

    const validationRules = {
		name: {
			rule: name => name.length >= 3,
			message: "Team name must be 3 characters or more."
		},
		paid: {
			rule: paid => newTeamState.plan === "FREE" || paid.toString().length > 0,
			message: "Please include an admin fee"
		},
        fee: {
			rule: (fee) => newTeamState.plan === "FREE" || fee.toString().length > 0,
			message: "Please include member fee"
		}
	}


    const handleSubmit = async (event) => {
        event.preventDefault()

        let isValid = true;
        let newErrors = {}

        for (const [field, {rule, message}] of Object.entries(validationRules)) {
			const val = newTeamState[field]
           
			if (!rule(val)) {
				isValid = false
				newErrors[field] = message
			}
		}
        setErrors(newErrors)



        if(isValid){
            //const createdTeam = await teamService.createTeam(newTeamState, token)
            //dispatch(addNewTeam(createdTeam))
        }
    }

    const handleChange = (e, field) => {
		const val = e.target.value
		setNewTeamState({...newTeamState, [field]: val})
        if (validationRules[field] && validationRules[field].rule(val)) {
			setErrors({...errors, [field]: null})
		}
	}

    return (
        <div>
            <h2>Create a New Team</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Team Name:</label>
                {errors.name ? <div className="error-text">{errors.name}</div> : null}
                <input
                    type="text"
                    id="name"
                    value={newTeamState.name}
                    onChange={(e) => handleChange(e, "name")}
                />
                <label htmlFor="type">Plan:</label>
                <select onChange={(e) => handleChange(e, "plan")} name="type" id="type">
                    <option value="FREE">Free Plan ⭐</option>
                    <option value="BENEFACTOR">Benefactor Plan 💸</option>
                    <option value="MEMBERSHIP">Paid Plan 💳</option>
                    <option value="HYBRID">Hybrid Plan 🔗</option>

                </select>
                <label htmlFor="schedule">Schedule:</label>
                <select onChange={(e) => handleChange(e, "schedule")} name="schedule" id="schedule">
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Each Week</option>
                    <option value="MONTHLY">Per Month</option>
                </select>
                <label htmlFor="distribSchedule">Give Points:</label>
                <select onChange={(e) => handleChange(e, "distribSchedule")} name="distribSchedule" id="distribSchedule">
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Each Week</option>
                    <option value="MONTHLY">Per Month</option>
                </select>
                <label htmlFor="payment">
                    <em>Disabled when free plan</em><p></p>
                    <label>
                        Member Fee $
                        {errors.paid ? <div className="error-text">{errors.paid}</div> : null}
                        <input 
                        value={newTeamState.paid}
                        onChange={(e) => handleChange(e, "paid")}
                        disabled={newTeamState.plan === "FREE"? true: false } 
                        name="paid" 
                        type="number"
                        />
                    </label>
                    <br />
                    <label>
                        Admin Fee $
                        {errors.fee ? <div className="error-text">{errors.fee}</div> : null}
                        <input 
                        value={newTeamState.fee}
                        onChange={(e) => handleChange(e, "fee")}
                        disabled={newTeamState.plan === "FREE"? true: false } 
                        name="fee" 
                        type="number"
                        />
                    </label>
                </label>
                <button className="uButton2" type="submit">Create Team</button>
                <label htmlFor="disclaimer">By pressing Submit you agree to pay the above.</label>
            </form>
        </div>
    )
}

export default CreateTeam
