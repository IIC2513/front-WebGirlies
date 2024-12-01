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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener el userId del token
  const payloadBase64 = token.split(".")[1];
  const payload = JSON.parse(atob(payloadBase64));
  const userId = payload.sub;

  useEffect(() => {
    const fetchMyGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/games/myGames/${userId}`
        );
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
        <h1 className="titulo-games">Your Games</h1>
        {games.length === 0 ? (
          <p>No tienes juegos creados.</p>
        ) : (
          <div className="cards-container">
            {games.map((game) => (
              <div className="card" key={game.gameId}>
                <h2 className="nombre-game">Game {game.gameId}</h2>
                <p>Participants: {game.playerCount}</p>
                {game.myCharacter && (
                  <div>
                    <h3>Character: {game.myCharacter.name}</h3>
                    <img
                      src={game.myCharacter.avatar}
                      alt={game.myCharacter.name}
                      className="character-avatar"
                    />
                  </div>
                )}
                <p>
                  Current Turn:{" "}
                  {game.currentTurnUserId
                    ? game.currentTurnUserId === userId
                      ? "It's your turn!"
                      : `Player ${game.currentTurnUserId}`
                    : "No active turn"}
                </p>
                <div className="button-container">
                  {game.status === 0 && (
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
                                g.gameId === game.gameId
                                  ? { ...g, status: 1 }
                                  : g
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
