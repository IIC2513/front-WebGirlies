import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Instructions from '../game/Instructions'
import UserWelcome from '../profile/user_welcome'
import LandingPage from './LandingPage'
import {Board} from '../game/Board'
import About from './About'
import Login from '../profile/Login'
import Signup from '../profile/Signup'
import AdminCheck from '../protected/AdminCheck'
import UserCheck from '../protected/UserCheck'
import LogoutButton from '../profile/Logout'

function Routing() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/board'} element={<Board/>}/>
                <Route path={'/about'} element={<About/>}/>
                <Route path={'/instructions'} element={<Instructions/>}/>
                <Route path={'/welcome'} element={<UserWelcome/>}/>
                <Route path={"/login"} element={<Login />}/>
                <Route path={"/signup"} element={<Signup />}/>
                <Route path={"/admincheck"} element={<AdminCheck />}/>
                <Route path={"/usercheck"} element={<UserCheck />}/>
                <Route path={''} element={<LandingPage/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Routing