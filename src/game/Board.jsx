import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import LogoutButton from '../profile/Logout';
import tablero from '../assets/images/Tablero__final.png';

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
        setPlaces(response.data["places"]);
        setCards(response.data["cards"]);
        console.log(response.data["cards"][0].cardInside.image);

        setCharacter(response.data["character"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className='BodyBoard'>
      <header className="headerBoard">
        <nav>
          <ul>
            <div className="links">
              <li><a href='/'>Start</a></li>
              <li><a href='/about'>About us</a></li>
              <li><a href='/instructions'>How to play</a></li>
              <li><a href='/board'>Play</a></li>
  
              {/* Mostrar Login y Sign Up solo si no hay token */}
              {!token ? (
                <>
                  <li id="login"><a href='/login'>Login</a></li>
                  <li id="signup"><a href='/signup'>Sign up</a></li>
                </>
              ) : (
                // Mostrar Logout si hay un token (usuario logueado)
                <li><LogoutButton /></li>
              )}
            </div>
          </ul>
        </nav>
      </header>
  
      <main>
        <GameContext.Provider value={{ cells, setCells, places, character }}>
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
                  gridColumn: cell.x + 1,
                  gridRow: cell.y + 1,
                }}
              >
                <img
                  src={cell.image}
                  alt={`Cell ${cell.x}, ${cell.y}`}
                  className="cell-image"
                />
  
                {places
                  .filter(place => place.doorX === cell.x && place.doorY === cell.y)
                  .map((place, index) => (
                    <React.Fragment key={index}>
                      {/* Imagen del lugar */}
                      <img
                        src={place.image}
                        alt={place.name}
                        className="place-image"
                        style={{
                          position: "absolute",
                          zIndex: 1,
                          left: `${place.doorX}%`,
                          top: `${place.doorY}%`,
                          transform: "translate(-50%, -50%)", // Centra el lugar
                        }}
                      />
  
                      {/* Agregar las cartas dentro del lugar */}
                      {cards
                        .filter(card => card.placeId === place.placeId) // Asociar la carta con el lugar
                        .map((card, cardIndex) => (
                          <img
                            key={cardIndex}
                            src={card.cardInside.image}
                            alt={card.name}
                            className="card-image"
                            style={{
                              position: "absolute",
                              zIndex: 2,  // Ajuste para que las cartas estén sobre el lugar
                              left: `${place.doorX + 5}%`,  // Desplazamiento para cartas dentro del lugar
                              top: `${place.doorY + 5}%`,   // Desplazamiento para cartas dentro del lugar
                              transform: "translate(-50%, -50%)", // Centra las cartas
                            }}
                          />
                        ))}
                    </React.Fragment>
                  ))}
  
                {/* Mostrar el personaje si está en la celda */}
                {character.positionX === cell.x && character.positionY === cell.y && (
                  <img
                    src={character.avatar}  // Asumo que el personaje tiene un avatar
                    alt={character.name}
                    className="character-avatar"
                    style={{
                      position: "absolute",
                      zIndex: 10,  // Asegura que el personaje esté sobre todo lo demás
                      left: `${cell.x}%`,
                      top: `${cell.y}%`,
                      transform: "translate(-50%, -50%)", // Centra el personaje
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </GameContext.Provider>
      </main>
    </div>
  );
}  
     