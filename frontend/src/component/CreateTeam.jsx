import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import teamService from '../services/team'
import {addNewTeam} from '../slices/userSlice.js'

const CreateTeam = () => {
    const [name, setName] = useState('')
    const token = useSelector(state => state.user.token)
    const dispatch = useDispatch()
    const [schedule, setSchedule] = useState('DAILY')
    const [distrib, setDistrib] = useState('MONTHLY')
    const [plan, setPlan] = useState('FREE')
    const [paid, setPaid] = useState(<input type="number"/>)
    const [fee, setFee] = useState(0);
    const [pool, setPool] = useState(0);


    const handleSubmit = async (event) => {
        event.preventDefault()
        dispatchNewSchedule()

        const newTeam = {
            name: name
        }
        const createdTeam = await teamService.createTeam(newTeam, token)
        dispatch(addNewTeam(createdTeam))
        setName('')
    }


    function dispatchNewSchedule() {
    //    alert(distrib + ", " + schedule)
    }

    function UpdateSchedule(e) {
        setSchedule(e.target.value)
    }

    function UpdateDistrib(e) {
        setDistrib(e.target.value)
    }

    function updateFee(e) {
        setFee(e.target.value)
    }

    function updatePool(e) {
        setPool(e.target.value)
    }

    function onPaidChange(e) {
        if (e.target.value === 'FREE') {
            setPaid(<input disabled type="number"/>);
        } else {
            setPaid(<input onChange={updateFee} type="number"/>)
        }
        setPlan(e.target.value)
    }

    return (
        <div>
            <h2>Create a New Team</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Team Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="type">Plan:</label>
                <select onChange={onPaidChange} name="type" id="type">
                    <option value="BENEFACTOR">Benefactor Plan 💸</option>
                    <option value="MEMBERSHIP">Paid Plan 💳</option>
                    <option value="FREE">Free Plan ⭐</option>
                    <option value="HYBRID">Hybrid Plan 🔗</option>

                </select>
                <label htmlFor="schedule">Schedule:</label>
                <select onChange={UpdateSchedule} name="schedule" id="schedule">
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Each Week</option>
                    <option value="MONTHLY">Per Month</option>
                </select>
                <label htmlFor="distribSchedule">Give Points:</label>
                <select onChange={UpdateDistrib} name="distribSchedule" id="distribSchedule">
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Each Week</option>
                    <option value="MONTHLY">Per Month</option>
                </select>
                <label htmlFor="payment">
                    <em>Disabled when free plan</em><p></p>
                    <label htmlFor="memberPay">Member Fee $
                        {paid}
                    </label><br/><label htmlFor="admminPay">Admin Fee $
                    {paid}
                </label>
                </label>
                <label htmlFor="ptPool">Initial Point Pool</label>
                <input onChange={updatePool} name={"ptPool"} id={"ptPool"} type="number"/>
                <label htmlFor="price">You will pay ${(pool/100)}</label>
                <label htmlFor="price2">For example, 250 points cost $2.50</label>
                <button className="uButton2" type="submit">Create Team</button>
                <label htmlFor="disclaimer">By pressing Submit you agree to pay the above.</label>
            </form>
        </div>
    )
}

export default CreateTeam
