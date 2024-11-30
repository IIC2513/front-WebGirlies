import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';  // Asegúrate de que tu contexto esté bien configurado
import { useNavigate } from 'react-router-dom';  // Para redirigir si es necesario
import Navbar from './Navbar';

export function MyGames() {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener el userId del token
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  const userId = payload.sub;  // Asegúrate de que 'sub' es el userId
  console.log("userId:", userId);

  useEffect(() => {
    // Función para obtener los juegos del usuario
    const fetchMyGames = async () => {
      try {
        setLoading(true);
        console.log(import.meta.env.VITE_BACKEND_URL);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/myGames/${userId}`);
        console.log(response.data.games)
        setGames(response.data.games);
        console.log("Juegos:", games);
      } catch (err) {
        setError(response.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGames();
  }, [userId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>Your Games</h1>
      {games.length === 0 ? (
        <p>No tienes juegos creados.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.gameId}>
              <div>
                <h3>Juego ID: {game.gameId}</h3>
                <p>Tablero ID: {game.gameId}</p>
                <button
                  onClick={() => navigate(`/board/${game.gameId}`)} // Redirige a la página del tablero
                >
                  Ver Tablero
                </button>
                <button onClick={() => axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/start`, {
                        gameId: game.gameId,
                        userId: userId,
                      })
                      .then(response => {
                        console.log("Juego iniciado:", response.data);
                      })
                      .catch(error => {
                        console.error("Error al iniciar el juego:", error);
                      })
                    }
                  >
                    Iniciar Juego
                  </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyGames;