import styles from './instructions.module.css';
import board from './../assets/images/baord.jpeg';
import LogoutButton from '../profile/Logout';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import Navbar from '../common/Navbar';

function Instructions() {
    const { token } = useContext(AuthContext);

    return (
    <div className={styles.instructions}>
        <Navbar />
        <div className={styles.mainInstructions}>
            <div className={styles.description_container}>
                <h3 className={styles.title}>How to Play</h3>
                <p className={styles.subtitle}><strong>Game Start</strong></p>
                <li className={styles.description}>Each player secretly receives their role and has the opportunity to select their avatar.</li>
                <li className={styles.description}>The game begins with all players in the center of the board, with clues and tasks distributed across the rooms.</li>
                <li className={styles.description}>Each player receives an item card.</li>
                <p className={styles.subtitle}><strong>Game Progression</strong></p>
                <li className={styles.description}>Players take turns sequentially.</li>
                <li className={styles.description}>Players collect cards that they must bring to the center to share with other players.</li>
                <li className={styles.description}>Each player can discard and note clues they believe are true/false based on their assumptions and prior information.</li>
                <p className={styles.subtitle}><strong>End of the Game</strong></p>
                <li className={styles.description}>The game ends when one of the following conditions is met:
                    <li className={styles.description}>The innocent players win if they reveal the impostor's identity or bring all tasks to the center of the board.</li>
                    <li className={styles.description}>The impostor wins if they remain undiscovered until the end of the game.</li>
                </li>
            </div>
            <img className={styles.imgtablero} src={board}/>
        </div>

    </div>
    )
}

export default Instructions