import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';  // Asegúrate de que tu contexto esté bien configurado
import { useNavigate } from 'react-router-dom';  // Para redirigir si es necesario
import Navbar from '../common/Navbar';
import './AllGames.css';
import VITE_BACKEND_URL from "../config";


// AQUI AGREGARIA EL TEMA DE QUE CUANTAS PERSONAS HAY UNIDAS A UN JUEGO (QUE NO SALGAN LAS COMPLETAS)
// Y QUE NO ESTEN EMPEZADAS


export function AllGames() {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  // Obtener el userId del token
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  const userId = payload.sub;  // Asegúrate de que 'sub' es el userId

  // Función para obtener el nombre de usuario por ID
  const fetchUsername = async (id) => {
    try {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.username;
    } catch (err) {
      console.error(`Error fetching username for ID ${id}:`, err);
      return `Player ${id}`; // Fallback si hay error
    }
  };

  useEffect(() => {
    // Función para obtener los juegos del usuario
    const fetchMyGames = async () => {
      try {
        setLoading(true);
        console.log(VITE_BACKEND_URL);
        const response = await axios.get(`${VITE_BACKEND_URL}/games/allGames`, {
          params: { userId }});
        
        console.log(response.data.games)
        const fetchedGames = Array.isArray(response.data.games)
        ? response.data.games
        : []; // Garantizar que sea un array

        if (fetchedGames.length > 0) {
          // Obtener nombres de usuarios para los IDs en currentTurnUserId
          const usernamesMap = { ...usernames }; // Copia local de usernames
          const usernamePromises = fetchedGames.map(async (game) => {
            if (
              game.currentTurnUserId &&
              !usernamesMap[game.currentTurnUserId]
            ) {
              const username = await fetchUsername(game.currentTurnUserId);
              usernamesMap[game.currentTurnUserId] = username;
            }
          });

          await Promise.all(usernamePromises); // Esperar a que se resuelvan todas las promesas
          setUsernames(usernamesMap); // Actualizar el estado con los nombres de usuario
        }
        setGames(fetchedGames); // Guardar los juegos
      } catch (err) {
        setError(err.message);
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
          <p>No available games</p>
        ) : (
          <div className="cards-container">
            {games.map((game) => (
              <div className="card" key={game.gameId}>
                <h2 className="nombre-game">Game {game.gameId}</h2>
                <p>Participants: {game.playerCount}</p>
                {game.status === 0 ? ( // Partida no iniciada
                  game.isUserPartOfGame ? ( // Soy parte de la partida
                    <div>
                      {game.myCharacter && (
                        <div>
                          <h3>Your character: {game.myCharacter.name}</h3>
                          <img
                            src={game.myCharacter.avatar}
                            alt={`${game.myCharacter.name} Avatar`}
                            className="character-avatar"
                          />
                          <p>You're already joined, but the game hasn't started yet</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="button-container">
                      {game.playerCount < 6 ? (
                        <button
                          className="card-button"
                          id="join-game"
                          onClick={() => navigate(`/character?gameId=${game.gameId}`, { state: { from: location.pathname } })}
                        >
                          Join Game
                        </button>
                      ) : (
                        <h1 id='game-started'>This game is full</h1>
                      )}
                    </div>
                  )
                ) : game.status === 1 ? ( // Partida iniciada
                  game.playerCount === 0 ? ( // Juego sin jugadores
                    <div>
                      <h1 id="game-finished">Game Finished</h1>
                    </div>
                  ) : game.isUserPartOfGame ? ( // El jugador es parte del juego
                    <div>
                      {game.myCharacter && (
                        <div>
                          <h3>Your character: {game.myCharacter.name}</h3>
                          <img
                            src={game.myCharacter.avatar}
                            alt={`${game.myCharacter.name} Avatar`}
                            className="character-avatar"
                          />
                        </div>
                      )}
                      <p
                        id={game.currentTurnUserId ? "turnos" : "no-active-turn"}
                      >
                        Current Turn:{" "}
                        {game.currentTurnUserId
                          ? game.currentTurnUserId === userId
                            ? "It's your turn!"
                            : usernames[game.currentTurnUserId] || "Loading..."
                          : "No active turn"}
                      </p>
                      <div className="button-container">
                        <button
                          className="card-button"
                          id="board"
                          onClick={() => navigate(`/board/${game.board.boardId}`)}
                        >
                          Go to board
                        </button>
                      </div>
                    </div>
                  ) : ( // El jugador no es parte del juego
                    <div>
                      <h1 id="game-started">Game started</h1>
                    </div>
                  )
                ) : game.status === 2 ? ( // Juego terminado
                  <div>
                    <h1 id="game-finished">Game Finished</h1>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllGames;