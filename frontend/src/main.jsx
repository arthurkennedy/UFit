import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store, persistor} from './store'

import './App.jsx'
import './style/Component.css' //import styles for components eg.(LoginPage, SignupPage)
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './style/App.css'
import './style/Utils.css'
import './style/Feed.css'
import './style/Profile.css'
import {BrowserRouter} from "react-router-dom";
import {PersistGate} from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter><App/></BrowserRouter>
      </PersistGate>
    </Provider>
)
