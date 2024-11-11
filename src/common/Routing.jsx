import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Instructions from '../game/Instructions'
import UserWelcome from '../profile/user_welcome'
import LandingPage from './LandingPage'
import About from './About'

function Routing() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/about'} element={<About/>}/>
                <Route path={'/instructions'} element={<Instructions/>}/>
                <Route path={'/welcome'} element={<UserWelcome/>}/>
                <Route path={''} element={<LandingPage/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Routing