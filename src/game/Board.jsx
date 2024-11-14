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
  const [character, setCharacter] = useState([]);
  const [diceValue, setDiceValue] = useState([]); 
  const [selectedCell, setSelectedCell] = useState([]);

  const moveCharacter = async (targetX, targetY) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/move`, {
        userId: 1,
        gameId: 1,
        targetX,
        targetY,
      });
      if (response) {
        // Actualizar posición del personaje
        setCharacter(prev => ({
          ...prev,
          positionX: targetX,
          positionY: targetY
        }));
        setDiceValue(0); // Resetear el valor del dado
      } else {
        console.error("Movimiento no permitido:", response.data.message);
      }
    } catch (error) {
      console.error("Error al mover el personaje:", error);
    }
  };
  
  // Evento de clic en la celda
  const handleCellClick = (cell) => {
    if (diceValue > 0) { // Solo permitir movimiento si el dado fue tirado
      setSelectedCell(cell);
      moveCharacter(cell.x, cell.y);
    }
  };

  const rollDice = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/dice`, {
            params: {  // Usa 'params' para incluir los datos en la URL de la solicitud
              userId: 1,
              gameId: 1,
            },
          });
        if (response) {
            setDiceValue(response.data.diceRoll);  // Actualiza el estado con el valor del dado
             
        } else {
            console.error('Error al tirar el dado:', response.data.details);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error.details);
    }
  };
  

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: 1 }  // Pasando boardId como parámetro
    })
      .then((response) => {
        const sortedCells = response.data["boards"]["0"].cells.sort((a, b) => a.id - b.id);
        setCells(sortedCells);
        console.log(sortedCells);
        setPlaces(response.data["places"]);
        setCards(response.data["cards"]);
        setCharacter(response.data["character"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <GameContext.Provider value={{ cells, setCells, places, character }}>
      <h1 className="title">Tablero</h1>
      <button onClick={rollDice}>Tirar Dado</button>
  
      {diceValue !== null && (
        <div>
          <h2>Resultado del Dado: {diceValue}</h2>
        </div>
      )}
      <div className="board">
        {cells.map(cell => (
          <div
            key={`${cell.x}-${cell.y}`}
            className="board-cell"
            onClick={() => handleCellClick(cell)}
            style={{
              gridColumn: cell.x + 1,  // Añade +1 porque las posiciones de grid comienzan en 1
              gridRow: cell.y + 1,
            }}
          >
            <img
              src={cell.image}
              alt={`Cell ${cell.x}, ${cell.y}`}
              className="cell-image"
              style={{
                position: 'absolute',
                zIndex: 1,
              }}
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
                    zIndex: 1,
                    left: `${place.doorX}%`,
                    top: `${place.doorY}%`,
                  }}
                />
              ))}
  
            {character.positionX === cell.x && character.positionY === cell.y && (
              <img
                src={character["Character"].avatar}
                alt={character.name}
                className="character-avatar"
                style={{
                  position: "absolute",
                  left: `${cell.x}%`,
                  top: `${cell.y}%`,
                  zIndex: 10,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </GameContext.Provider>
  );
  }
     