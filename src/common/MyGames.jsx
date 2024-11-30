import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';  // Asegúrate de que tu contexto esté bien configurado
import { useNavigate } from 'react-router-dom';  // Para redirigir si es necesario
import Navbar from './Navbar';
import './AllGames.css';

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
        console.log(response)
        console.log("Juegos:", response.data);
        setGames(response.data.games);
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
    <div className='BodyGames'>
      <Navbar />
      <main className="games-main">
        <h1 className='titulo-games'>Your Games</h1>
        {games.length === 0 ? (
          <p>No tienes juegos creados.</p>
        ) : (
          <div className="cards-container">
            {games.map((game) => (
              <div className="card" key={game.gameId}>
                <h2 className='nombre-game'>Game {game.gameId}</h2>
                <div className="button-container">
                  {/* Mostrar "Start game" solo si el juego no está iniciado */}
                  {game.status === 0 && (
                    <button
                      className="card-button"
                      id="start"
                      onClick={() =>
                        axios
                          .post(`${import.meta.env.VITE_BACKEND_URL}/games/start`, {
                            gameId: game.gameId,
                            userId: userId,
                          })
                          .then((response) => {
                            console.log("Juego iniciado:", response.data);
                            // Actualizar estado del juego en la UI tras iniciar el juego
                            setGames((prevGames) =>
                              prevGames.map((g) =>
                                g.gameId === game.gameId ? { ...g, status: 1 } : g
                              )
                            );
                          })
                          .catch((error) => {
                            console.error("Error al iniciar el juego:", error);
                          })
                      }
                    >
                      Start game
                    </button>
                  )}

                  {/* Mostrar "Go to board" solo si el juego está iniciado */}
                  {game.status === 1 && (
                    <button
                      className="card-button"
                      id="board"
                      onClick={() => navigate(`/board/${game.boardId}`)}
                    >
                      Go to board
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        )}
      </main>
    </div>
  );
}

export default MyGames;