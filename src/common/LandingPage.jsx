import styles from './Landing.module.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios';
import VITE_BACKEND_URL from "../config";

function LandingPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para redirigir
  const [showModal, setShowModal] = useState(false);

  // Función para mostrar el modal de alerta
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateGame = async () => {
    // Verificamos si hay token
    if (!token) {
      handleShowModal(); // Mostrar popup de login si no está autenticado
      return;
    }
    console.log("Token:", token);
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const userId = payload.sub || null;
    console.log("userId:", userId);
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/games/create`,
        { ownerId: userId }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Juego creado:", response.data);

      const gameId = response.data.boardId; 

      navigate(`/character?gameId=${gameId}`); // Redirige con el gameId como parámetro
    } catch (error) {
      console.log("Error starting new game:", error);
      alert("Error starting new game");
    }
  };

  const handleJoinGame = () => {
    if (!token) {
      handleShowModal(); // Mostrar popup de login si no está autenticado
      return;
    }
    navigate("/allGames");
  };

  return (
    <div>
      <Navbar />
      <div className={styles.MainLanding}>
        <h1 className={styles.title}>Murder in the Hospital</h1>
        <div className={styles.description}>
          <div className={styles.buttonContainer}>
            <button className={styles.buttonGame} onClick={handleJoinGame}>
              Join a Game
            </button>
            <button className={styles.buttonGame} onClick={handleCreateGame}>
              Create a Game
            </button>
          </div>
          <p>
            Police game that revolves around solving a murder. There will be an impostor/murderer that players must discover. Players will have to gather clues and try to solve the crime, discovering both the location, the murderer and the weapon, but the impostor will try to divert attention so that he is not discovered.
          </p>
        </div>
      </div>

      {/* Modal de alerta si el usuario no está autenticado */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>You need to log in first.</p>
            <button onClick={() => navigate("/login")}>Go to Login</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;