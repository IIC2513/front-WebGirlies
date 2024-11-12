import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

// Exporta el contexto y el componente sin usar `default`
export const GameContext = createContext(null);

export function Board() {
  const { token } = useContext(AuthContext);
  const [cells, setCells] = useState([]);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: 1 }  // Pasando boardId como parámetro
    })
      .then((response) => {
        const data = response.data[0]; // Accede al primer objeto de la respuesta
        setCells(data.cells);
        setPlayerName(data.Player?.name || ""); // Verifica si existe Player
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  return (
    <GameContext.Provider value={{ cells, setCells }}>
      <h1 className="title">Tablero de {playerName}</h1>
      <div className="board">
        <div className="board-row">
          {cells.map(cell => (
            <img
              src={cell.image}
              id={cell.cellId}
            />
          ))}
        </div>
      </div>
    </GameContext.Provider>
  );
}
