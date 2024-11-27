import './about.css';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import creator1Image from '../assets/images/XavieraJorquera.jpeg';
import creator2Image from '../assets/images/MatildeGalarce.jpeg';
import creator3Image from '../assets/images/Asael.jpeg';
import Navbar from '../common/Navbar';

function About() {
    const { token } = useContext(AuthContext);

    return (
    <div className='BodyAbout'>
        <Navbar />
        <main className='Mainabout'>
            <h1 className="title-about">About us</h1>
            <p className="description">
                We are a team of specialists with extensive knowledge in the video game industry.
                We want everyone to be able to enjoy our game.
            </p>
            
            <div className="creators-container">
                <div className="creator">
                <img src= {creator1Image} alt="Creator 1" className="creator-photo" />
                <p className="creator-caption">Creator 1 - Lead Designer</p>
                </div>
                <div className="creator">
                <img src= {creator2Image} alt="Creator 2" className="creator-photo" />
                <p className="creator-caption">Creator 2 - Lead Developer</p>
                </div>
                <div className="creator">
                <img src= {creator3Image} alt="Creator 3" className="creator-photo" />
                <p className="creator-caption">Creator 3 - Developer and Designer</p>
                </div>
            </div>
        </main>
    </div>
  )
}

export default About
