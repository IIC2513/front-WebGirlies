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
        console.log(response.data["cards"]);
        setCells(response.data["boards"]["0"].cells);
        setPlaces(response.data["places"]);
        setCards(response.data["cards"]);
        setCharacter(response.data["character"]);
        console.log(character["Character"].avatar);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <GameContext.Provider value={{ cells, setCells, places, character }}>
      <h1 className="title">Tablero</h1>
      <button onClick={rollDice}>Tirar Dado</button>  {/* Botón para tirar el dado */}
      
      {diceValue !== null && (
        <div>
          <h2>Resultado del Dado: {diceValue}</h2>  {/* Muestra el resultado del dado */}
        </div>
      )}
      <div className="board">
        {cells.map(cell => (
          <div key={`${cell.x}-${cell.y}`} className="board-cell" style={{ position: 'relative' }}>
            <img
              src={cell.image}
              alt={`Cell ${cell.x}, ${cell.y}`}
              className="cell-image"
              style={{
                position: 'absolute',
                zIndex: 1, // Asegúrate de que las celdas estén debajo del personaje
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
                    zIndex: 1,  // Asegúrate de que las imágenes de los lugares estén debajo del personaje
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
                  left: `${cell.x}%`, // Ajusta la posición según tus necesidades
                  top: `${cell.y}%`,  // Ajusta la posición según tus necesidades
                  zIndex: 10,         // Este valor garantiza que el personaje quede encima de todos los demás elementos
                }}
              />
            )}
          </div>
        ))}
      </div>
    </GameContext.Provider>
  );
  }  