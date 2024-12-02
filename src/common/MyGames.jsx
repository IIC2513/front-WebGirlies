import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./AllGames.css";

export function MyGames() {
  const { token } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener el userId del token
  const payloadBase64 = token.split(".")[1];
  const payload = JSON.parse(atob(payloadBase64));
  const userId = payload.sub;
  
  // Función para obtener el nombre de usuario por ID
  const fetchUsername = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
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

  // Fetch de juegos
  useEffect(() => {
    const fetchMyGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/games/myGames/${userId}`
        );
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
        <h1 className="titulo-games">Your Games</h1>
        {games.length === 0 ? (
          <p>You don't have games created</p>
        ) : (
          <div className="cards-container">
            {games.map((game) => (
              <div className="card" key={game.gameId}>
                <h2 className="nombre-game">Game {game.gameId}</h2>
                <p>Participants: {game.playerCount}</p>
                {game.myCharacter && (
                  <div>
                    <h3>Your character: {game.myCharacter.name}</h3>
                    <img
                      src={game.myCharacter.avatar}
                      alt={game.myCharacter.name}
                      className="character-avatar"
                    />
                  </div>
                )}
                <p 
                id={
                  game.currentTurnUserId
                    ? "turnos"
                    : "no-active-turn"
                }>
                  Current Turn:{" "}
                  {game.currentTurnUserId
                    ? game.currentTurnUserId == userId
                      ? "It's your turn!"
                      : usernames[game.currentTurnUserId] || "Loading..."
                    : "No active turn"}
                </p>
                <div className="button-container">
                {game.status === 0 && (
                  game.myCharacter === null ? (
                    <button
                      className="card-button"
                      id="start"
                      onClick={() => navigate(`/character?gameId=${game.gameId}`)}
                    >
                      Choose Character
                    </button>
                  ) : (
                    <button
                      className="card-button"
                      id="start"
                      onClick={() =>
                        axios
                          .post(
                            `${import.meta.env.VITE_BACKEND_URL}/games/start`,
                            {
                              gameId: game.gameId,
                              userId: userId,
                            }
                          )
                          .then((response) => {
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
                      Start Game
                    </button>
                  )
                )}

                  {game.status === 1 && (
                    <button
                      className="card-button"
                      id="board"
                      onClick={() => navigate(`/board/${game.board.boardId}`)}
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
