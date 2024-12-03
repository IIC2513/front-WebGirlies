import styles from './instructions.module.css';
import board from './../assets/images/baord.jpeg';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import Navbar from '../common/Navbar';
import axios from 'axios';
import VITE_BACKEND_URL from "../config";

function Instructions() {
    const { token } = useContext(AuthContext);
    const [characters, setCharacters] = useState([]);
    
    // Decodificar el token y obtener el userId
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const userId = payload.sub || null;

    useEffect(() => {
        axios.get(`${VITE_BACKEND_URL}/characters`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            setCharacters(response.data);
        })
        .catch((error) => {
            console.log("Error fetching characters:", error);
        });
    }, [token]);

    return (
        <div className={styles.instructions}>
            <Navbar />
            <h3 className={styles.title}>How to Play</h3>
            <div className={styles.mainInstructions}>
                <div className={styles.description_container}>
                    <p className={styles.subtitle}><strong>Game Start</strong></p>
                    <li className={styles.description}>Each player has the opportunity to select their avatar.</li>
                    <li className={styles.description}>The game begins with cards of suspects, weapons, and rooms placed in their respective categories. A card from each category is randomly selected and placed in the confidential envelope, which contains the solution to the case.</li>
                    <li className={styles.description}>The remaining cards are shuffled and distributed among the players and rooms.</li>
                    <p className={styles.subtitle}><strong>Game Progression</strong></p>
                    <li className={styles.description}>Players take turns rolling a die to move around the board towards rooms that contain cards, allowing them to collect them.</li>
                    <li className={styles.description}>Each player can discard and note clues they believe to be true/false based on their assumptions and prior information.</li>
                    <p className={styles.subtitle}><strong>Making an Accusation</strong></p>
                    <li className={styles.description}>When a player believes they know the solution, they can make an accusation. If the accusation is correct, the player wins. If it’s incorrect, the player is eliminated and can no longer play or make accusations.</li>
                    <p className={styles.subtitle}><strong>End of the Game</strong></p>
                    <li className={styles.description}>The game ends when one of the following conditions is met:
                        <li className={styles.description}>A player wins by correctly guessing the suspect, weapon, and room.</li>
                        <li className={styles.description}>The game continues until a player makes a correct accusation or is eliminated.</li>
                    </li>
                    <p className={styles.subtitle}><strong>Eliminating Suspects</strong></p>
                    <li className={styles.description}>Each card seen or discarded helps deduce which cards are in the confidential envelope, moving players closer to solving the case.</li>
                </div>
                <div className={styles.TableroConteinerAbout}>
                    <img className={styles.imgtablero} src={board} alt="Game board" />
                </div>
            </div>
            <h3 className={styles.title2}>Characters</h3>
            <div className="character-grid">
                {characters.map((character) => (
                    <div className='character-card'>
                        <img
                            src={character.avatar}
                            alt={`${character.name} avatar`}
                            className={styles.characterAvatar}
                        />
                        <div className={styles.characterDescription}>
                            <h2>{character.name}</h2>
                            <p>Edad: {character.age}</p>
                            <p>Objeto distintivo: {character.distinctiveItem}</p>
                            <p>{character.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Instructions;
