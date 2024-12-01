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
    <div className="BodyGames">
      <Navbar />
      <main className="games-main">
        <h1 className="titulo-games">All Games</h1>
        {games.length === 0 ? (
          <p>No hay juegos creados.</p>
        ) : (
          <div className="cards-container">
            {games.map((game) => (
              <div className="card" key={game.gameId}>
                <h2 className="nombre-game">Game {game.gameId}</h2>
                <p>Participants: {game.playerCount}</p>
                {game.status === 1 ? ( // Partida no iniciada
                  game.isUserPartOfGame ? ( // Soy parte de la partida
                    <p>Ya estás unido, pero la partida aún no comienza.</p>
                  ) : (
                    <div className="button-container">
                      <button
                        className="card-button"
                        onClick={() => navigate(`/character?gameId=${game.gameId}`)}
                      >
                        Unirme
                      </button>
                    </div>
                  )
                ) : game.isUserPartOfGame ? ( // Partida iniciada y soy parte
                  <div>
                    <p>It's your turn: {game.isMyTurn ? 'Yes' : 'No'}</p>
                    <p>Current turn belongs to User ID: {game.currentTurnUserId}</p>
                    {game.myCharacter && (
                      <div>
                        <p>Your Character: {game.myCharacter.name}</p>
                        <img
                          src={game.myCharacter.avatar}
                          alt={`${game.myCharacter.name} Avatar`}
                          className="character-avatar"
                        />
                        <p>{game.myCharacter.description}</p>
                      </div>
                    )}
                  </div>
                ) : ( // Partida iniciada pero no soy parte
                  <div>
                    <p>Status: Started</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllGames;