import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

// Exporta el contexto y el componente sin usar `default`
export const GameContext = createContext(null);

export function Board() {
  const { token } = useContext(AuthContext);
  const [cells, setCells] = useState([]);
  const [places, setPlaces] = useState([]);
  

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: 1 }  // Pasando boardId como parámetro
    })
      .then((response) => {
        console.log(response.data["places"]);
        const data = response.data;
        setCells(response.data["boards"]["0"].cells);
        setPlaces(response.data["places"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

return (
  <GameContext.Provider value={{ cells, setCells, places }}>
    <h1 className="title">Tablero</h1>
    <div className="board">
      {cells.map(cell => (
        <div key={`${cell.x}-${cell.y}`} className="board-cell">
          <img
            src={cell.image}
            alt={`Cell ${cell.x}, ${cell.y}`}
            className="cell-image"
          />
          {places
            .filter(place => place.doorX === cell.x && place.doorY === cell.y)
            .map((place, index) => (
              <img
                key={index}
                src={place.image}
                alt={place.name}
                className="place-image"
                style={{
                  position: "absolute",
                  left: `${place.doorX}%`, 
                  top: `${place.doorY}%`,
                }}
              />
          ))}
        </div>
      ))}
    </div>
  </GameContext.Provider>
  );
}
