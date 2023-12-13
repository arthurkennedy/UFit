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
        distrib: "DAILY",
        plan: "FREE",
        membership: 0,
        fee: 0,
    }

    const [newTeamState, setNewTeamState] = useState(initialTeamState)
    const [errors, setErrors] = useState({})

    const [disablePayment, setDisablePayment] = useState({membership: true, fee: true});

    const validationRules = {
		name: {
			rule: name => name.length >= 3,
			message: "Team name must be 3 characters or more."
		},
		membership: {
			rule: (membership) => disablePayment.membership? true: newTeamState.plan === "FREE" || (membership.toString().length > 0 && parseInt(membership) !== 0),
			message: "Please include a membership fee"
		},
        fee: {
			rule: (fee) => disablePayment.fee? true: newTeamState.plan === "FREE" || (fee.toString().length > 0 && parseInt(fee) !== 0),
			message: "Please include admin fee"
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
            const team = {
                name: newTeamState.name,
                subscriptionDetails: {
                    schedule: newTeamState.schedule,
                    distributionSchedule: newTeamState.distrib,
                    type: newTeamState.plan,
                    memberFee: newTeamState.membership,
                    adminFee: newTeamState.fee
                }
            }
            const createdTeam = await teamService.createTeam(team, token)
            console.log(createdTeam);
            dispatch(addNewTeam(createdTeam))
        }
    }

    const handleChange = (e, field) => {
		const val = e.target.value

        setNewTeamState({...newTeamState, [field]: val})

        if (validationRules[field] && validationRules[field].rule(val)) {
			setErrors({...errors, [field]: null})
		}

        if(field === "plan"){
            let notMembership = true, notFee = true;

            if(val === "HYBRID"){
                notMembership = false;
                notFee = false;
            }else if(val === "MEMBERSHIP"){
                notMembership = false;
                notFee = true;
            }else if(val === "BENEFACTOR"){
                notMembership = true;
                notFee = false;
            }

            setErrors({...errors, ["membership"]: null, ["fee"]: null}); // disable errors for membership and fees

            setDisablePayment({membership: notMembership, fee: notFee});
        }

	}

    const schedulePoints = {
        "DAILY": 1,
        "WEEKLY": 2,
        "MONTHLY": 3
    };

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
                    <option value="MEMBERSHIP">Membership Plan 💳</option>
                    <option value="HYBRID">Hybrid Plan 🔗</option>

                </select>
                <label htmlFor="schedule">Schedule:</label>
                <select onChange={(e) => handleChange(e, "schedule")} name="schedule" id="schedule">
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Each Week</option>
                    <option value="MONTHLY">Per Month</option>
                </select>
                <label htmlFor="distribSchedule">Give Points:</label>
                <select value={schedulePoints[newTeamState.distribSchedule] > schedulePoints[newTeamState.schedule]? "DAILY": newTeamState.distribSchedule} onChange={(e) => handleChange(e, "distribSchedule")} name="distribSchedule" id="distribSchedule">
                    <option value="DAILY">Every Day</option>
                    <option disabled={schedulePoints[newTeamState.schedule] < 2? true: false } value="WEEKLY">Each Week</option>
                    <option disabled={schedulePoints[newTeamState.schedule] < 3? true: false } value="MONTHLY">Per Month</option>
                </select>
                <label htmlFor="payment">
                    <em>Disabled when free plan</em><p></p>
                    <label>
                        Member Fee $
                        {errors.membership ? <div className="error-text">{errors.membership}</div> : null}
                        <input 
                        value={newTeamState.membership}
                        onChange={(e) => handleChange(e, "membership")}
                        disabled={disablePayment.membership? true: false }
                        name="membership"
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
                        disabled={disablePayment.fee? true: false } 
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
