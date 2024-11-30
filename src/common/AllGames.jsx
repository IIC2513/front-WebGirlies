import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';  // Asegúrate de que tu contexto esté bien configurado
import { useNavigate } from 'react-router-dom';  // Para redirigir si es necesario
import Navbar from '../common/Navbar';
import './AllGames.css';


// AQUI AGREGARIA EL TEMA DE QUE CUANTAS PERSONAS HAY UNIDAS A UN JUEGO (QUE NO SALGAN LAS COMPLETAS)
// Y QUE NO ESTEN EMPEZADAS


export function AllGames() {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/allGames`, {
          params: { userId }});
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
        <h1 className='titulo-games'>All Games</h1>
        {games.length === 0 ? (
          <p>No hay juegos creados.</p>
        ) : (
          <div className="cards-container">
            {games.map((game) => (
              <div className="card" key={game.gameId}>
                <div>
                  <h2 className='nombre-game'>Game {game.gameId}</h2>
                  <p>Participants: {game.playerCount}</p>
                  <div className="button-container">
                    <button
                      className="card-button"
                      onClick={() => navigate(`/character?gameId=${game.gameId}`)} // Redirige a detalles del juego
                    >
                      Unirme
                    </button>
                    <button
                      className="card-button"
                      onClick={() => navigate(`/board/${game.boardId}`)} // Redirige a la página del tablero
                    >
                      Ver Tablero
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllGames;