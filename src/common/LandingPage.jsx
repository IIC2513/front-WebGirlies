import styles from './Landing.module.css';
import LogoutButton from '../profile/Logout';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import Navbar from '../common/Navbar';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios';


function LandingPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para redirigir




  const handleCreateGame = async () => {
    console.log("Token:", token); // Aquí tienes el token
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const userId =  payload.sub || null;
    console.log("userId:", userId);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/games/create`,
        { ownerId: userId }, // Ajusta según los datos necesarios para crear el juego
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Juego creado:", response.data);
      const gameId = response.data.gameId; // Suponiendo que el backend devuelve gameId
      navigate(`/character?gameId=${gameId}`); // Redirige con el gameId como parámetro
    } catch (error) {
      console.log("Error al crear el juego:", error);
      alert("Error al crear el juego");
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.MainLanding}>
        <h1 className={styles.title}>Murder in the Hospital</h1>
        <div className={styles.description}>
          <div className={styles.buttonContainer}>
            <Link to="/character" className={styles.button}>
              Join Game
            </Link>
            <button className={styles.button} onClick={handleCreateGame}>
              Create a Game
            </button>
          </div>
          <p>
            Police game that revolves around solving a murder. There will be an impostor/murderer that players must discover. Players will have to gather clues and try to solve the crime, discovering both the location, the murderer and the weapon, but the impostor will try to divert attention so that he is not discovered.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;



