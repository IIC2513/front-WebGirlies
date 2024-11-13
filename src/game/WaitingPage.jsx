import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegura la importación de useNavigate
import './WaitingPage.css';
import { AuthContext } from '../auth/AuthContext'; 
import axios from 'axios';


function GameView() { // Asegúrate de pasar isAuthenticated como prop si viene de otra parte
  const [isJoined, setIsJoined] = useState([]);
  const [isOwner, setIsOwner] = useState([]);
  const [gameStatus, setGameStatus] = useState(null); // Ej: null, "waiting", "started"
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const gameId = 1; // ID de la partida
  const userId = 2; // ID del usuario

  useEffect(() => {
    if (!token) {
      navigate('/login');  // Redirige a la página de inicio de sesión si no está autenticado
    }
  }, [token, navigate]);

  if (!token) {
    return null;  // Evita que el componente se renderice si no está autenticado
  }

  useEffect(() => { //esto se esta mandando mal
    // Función para verificar si el usuario ya se unió a la partida y obtener el estado de la partida
    async function fetchGameStatus() {
      try {
        console.log(userId, gameId);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/${gameId}/status`, {userId: userId});
        console.log(response.data);
        const data = await response.data;
        setIsJoined(data["joined"]);
        setIsOwner(data["ownerId"] === userId);
        setGameStatus(data["status"]);
      } catch (error) {
        console.error("Error al obtener el estado del juego:", error);
      }
    }
    fetchGameStatus();
  }, []);

  const handleJoinGame = async () => {
    navigate('/character')
  };
//que revise si es mia la partida y si ya se unio
  return ( 
    <div>
      {gameStatus === 'started' ? (
        <p>¡La partida ha comenzado!</p>
      ) : (
        <div>
          {isJoined ? (
            <p>Esperando a que el dueño inicie la partida...</p>
          ) : (
            <div>
              <p>¿Listo para jugar?</p>
              <p>¡Únete a la partida!</p>
              <button onClick={handleJoinGame}>Unirse a la partida</button>
            </div>
          )}
          {isOwner && (
            <p>Eres el dueño de esta partida. Puedes iniciar el juego cuando haya suficientes jugadores.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default GameView;
