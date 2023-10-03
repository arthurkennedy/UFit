import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './App.css'  //import styles for global elements
import './component/Components.css'  //import styles for components eg.(LoginPage, SignupPage)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
