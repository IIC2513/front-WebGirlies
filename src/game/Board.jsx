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
  const [cards, setCards] = useState([]);
  

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: 1 }  // Pasando boardId como parámetro
    })
      .then((response) => {
        console.log(response.data["cards"]);
        setCells(response.data["boards"]["0"].cells);
        setPlaces(response.data["places"]);
        setCards(response.data["cards"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <GameContext.Provider value={{ cells, setCells, places, cards }}>
      <h1 className="title">Tablero</h1>
      <div className="board">
        {cells.map(cell => (
          <div key={`${cell.x}-${cell.y}`} className="board-cell">
            <img
              src={cell.image}
              alt={`Cell ${cell.x}, ${cell.y}`}
              className="cell-image"
            />
            {/* Filtrar y mostrar lugares */}
            {places
              .filter(place => place.doorX === cell.x && place.doorY === cell.y)
              .map((place, index) => (
                <div key={index} className="place-container">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="place-image"
                    style={{
                      position: "absolute",
                      left: `${place.doorX}%`,
                      top: `${place.doorY}%`,
                    }}
                  />
                  {/* Mostrar cartas correspondientes a este lugar */}
                  {cards
                    .filter(card => card.placeId === place.placeId) // Filtrar por placeId
                    .map((card, index) => (
                      <div key={index} className="card-container" style={{ position: "absolute", top: "10px", left: "10px" }}>
                        <img
                          src={card.cardInside.image}
                          alt={card.cardInside.description}
                          className="card-image"
                        />
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </GameContext.Provider>
  );
}  