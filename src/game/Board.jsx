import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import tablero from '../assets/images/Tablero__final.png';
import Navbar from '../common/Navbar';

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
  <div className='BodyBoard'>
    <Navbar />
    <main className='MainBoard'>
      <div>
        <button onClick={rollDice}>Tirar Dado</button>
          {diceValue !== null && (
            <div>
              <h2 className='resultado'>Resultado del Dado: {diceValue}</h2>
            </div>
          )}
      </div>
      <div className='AllBoard'>
        <GameContext.Provider value={{ cells, setCells, places, character }}>
          <div className="board-container">
            <img src={tablero} alt="Tablero Marco" className="board-frame" />
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
                  {character.positionX === cell.x && character.positionY === cell.y && (
                    <img
                      src={character["Character"].avatar}
                      alt={character.name}
                      className="character-board"
                      style={{
                        position: "absolute",
                        left: `${cell.x}%`,
                        bottom: `${cell.y}%`,
                        zIndex: 10,
                      }}
                    />
                  )}
                  <img
                    src={cell.image}
                    alt={`Cell ${cell.x}, ${cell.y}`}
                    className="cell-image"
                  />
                  {/* Imágenes de los lugares dentro de la celda */}
                {places
                  .filter(place => place.doorX === cell.x && place.doorY === cell.y)
                  .map((place, index) => (
                    <React.Fragment key={index}>
                      {/* Agrega las cartas dentro del lugar */}
                      {cards
                        .filter(card => card.placeId === place.placeId) // Asocia la carta con el lugar
                        .map((card, cardIndex) => (
                          <img
                            key={cardIndex}
                            src={card.cardInside.image}
                            alt={card.name}
                            className="card-image"
                            style={{
                              position: "absolute",
                              zIndex: 3,  // Asegura que las cartas estén sobre el lugar
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        ))}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </GameContext.Provider>
      </div>
    </main>
  </div>
  );
  }
     