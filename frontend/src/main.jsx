import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store'

import './App.jsx'  //import styles for global elements
import './style/Component.css' //import styles for components eg.(LoginPage, SignupPage)
import './style/App.css'
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter><App/></BrowserRouter>
    </Provider>
)
