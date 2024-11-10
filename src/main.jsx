import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserWelcome from './user_welcome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <UserWelcome />
  </StrictMode>,
)
