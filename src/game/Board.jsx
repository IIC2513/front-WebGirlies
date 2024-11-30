import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import tablero from '../assets/images/Tablero__final.png';
import Navbar from '../common/Navbar';
import { useParams } from 'react-router-dom';
import DiceRoller from './DiceRoller';

// Exporta el contexto y el componente sin usar `default`
export const GameContext = createContext(null);

export function Board() {
  const { token } = useContext(AuthContext);
  const [cells, setCells] = useState([]);
  const [places, setPlaces] = useState([]);
  const [cards, setCards] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [diceValue, setDiceValue] = useState([]); 
  const [selectedCell, setSelectedCell] = useState([]);
  const {boardId} = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [myCharacter, setMyCharacter] = useState(null);
  const [myRole, setMyRole] = useState('');
  const [myCards, setMyCards] = useState([]);
  const [isInAPlace, setIsInAPlace] = useState(false);
  const [abilities, setAbilities] = useState([]);
  const [note, setNote] = useState(''); // Inicializa el estado para las notas
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  const userId = payload.sub;  // Asegúrate de que 'sub' es el userId
  console.log("userId:", userId);

  const handlePopup = () => {
    console.log('Popup toggled');
    setShowPopup(!showPopup); // Alternar visibilidad del popup
    setPopupContent('Aquí puedes escribir o ver tus notas.'); // Cambia el contenido según lo necesites
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value); // Actualiza el contenido de la nota
  };
  
  const saveNote = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/notes/${boardId}/${userId}`, {
        notes: note, // Envía la nueva nota al backend
      });
      console.log('Nota guardada:', response.data);
      setShowPopup(false); // Cierra el popup después de guardar
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    }
  };  

  const changeTurn = () => {
    setCharacters(prev =>
      prev.map((character, index) => ({
        ...character,
        turn: index === (prev.findIndex(c => c.turn) + 1) % prev.length, // Asignar el turno al siguiente personaje
      }))
    );
  };
  
  const fetchNote = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes/${boardId}/${userId}`);
      console.log('Nota obtenida:', response.data);
      setNote(response.data.notes); // Actualiza el estado con la nota obtenida
    } catch (error) {
      console.error('Error al obtener la nota:', error);
    }
  };

  
  const moveCharacter = async (targetX, targetY) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/move`, {
        userId: userId,
        gameId: boardId,
        targetX,
        targetY,
      });

      console.log("Respuesta del movimiento:", response);
      console.log("Personajes:", characters);
      console.log("esta en la pieza:", response.data.atAPlace);
  
      if (response && response.data) {
        // Actualiza el personaje con la nueva posición
        console.log("characters:", characters);
        

        setCharacters(prev => prev.map(character =>
          character.characterId === response.data.characterId
            ? { ...character, positionX: response.data.data.x, positionY: response.data.data.y }
            : character
        ));
        setDiceValue(0); // Resetear el valor del dado
        changeTurn(); // Cambiar el turno
        setIsInAPlace(response.data.atAPlace);
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
              userId: userId,
              gameId: boardId,
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
    console.log("Obteniendo datos del tablero...");
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: boardId, userId: userId }
    })
      .then((response) => {
        const sortedCells = response.data["boards"]["0"].cells.sort((a, b) => a.id - b.id);
        const numericUserId = Number(userId); // Realiza esta conversión al inicio
        const myCharacters = response.data.character.find(
          character => character.User.userId === numericUserId
        );
        console.log("INFO RECIBIDA",response.data)
        setMyCharacter(myCharacters);
        setMyRole(myCharacters.role);
        console.log("Mi personaje:", myCharacters);
        setCells(sortedCells);
        setPlaces(response.data["places"]);
        setCards(response.data["cards"]);
        setCharacters(response.data["character"]); // Asegúrate de que aquí se está actualizando correctamente
        setAbilities(response.data.abilities);
        setMyCards(response.data["MyCards"]);
        console.log("Mis cartas:", response.data["MyCards"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [boardId, userId]);  // Depende de boardId y userId para recargar cuando cambien
  
  useEffect(() => {
    console.log("Updated characters:", characters);
  }, [characters]);  // Este useEffect se ejecutará cada vez que 'characters' cambie

  useEffect(() => {
    // Llama a la función para obtener las notas al cargar la página
    fetchNote();
    console.log("Obteniendo notas...");
    console.log("notes:", note);
  }, [boardId, userId]);
  

return (
  <div className='BodyBoard'>
  <Navbar />
  <main className='MainBoard'>
    {/* Contenedor horizontal para los personajes */}
    <div className="character-turn-order-horizontal">
        {characters
          .sort((a, b) => a.joinOrder - b.joinOrder) // Ordena los personajes por su orden de entrada
          .map(character => (
            <div
              key={character.characterId}
              className={`character-item-horizontal ${character.turn ? '' : 'inactive'}`} // Clase condicional
            >
              <img
                src={character["Character"].avatar}
                alt={character.name}
                className="character-avatar-horizontal"
              />
              <p>{character.Character.name}</p>
              <p>{character.User.username}</p>

            </div>
          ))}
      </div>

      <div className='contenedor-board-dashboard'>
        <div className='contenedor-dashboard'>
          <h2>Role: {myRole}</h2>
          <div className='contenedor-dado'>
            {diceValue !== null && <DiceRoller diceValue={diceValue} />}
            <button className='dice-roller-button' onClick={rollDice}>Roll Dice</button>
            {/* Botón para mostrar/ocultar el popup */}
            <button className='popup-toggle-button' onClick={() => { console.log('Botón de notas clickeado'); handlePopup(); }}>
              Notas
            </button>

            {/* Popup que se muestra al lado del dado */}
            {showPopup && (
                <div className="popup" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="popup-content">
                    <button className="close-button" onClick={handlePopup}>X</button>
                    <textarea
                      value={note}
                      onChange={handleNoteChange}
                      placeholder="Escribe tus notas aquí..."
                      rows={5}
                      style={{ width: '100%' }}
                    />
                    <button onClick={saveNote}>Guardar Nota</button>
                  </div>
                </div>
              )}
              <div>
                <button>
                  Acusse
                </button>
              </div>
            </div>
            <div>
                <h2>Mis cartas</h2>
                <ul>
                  {myCards.map(card => (
                    <li key={card.id}>
                      <p>{card["Card"].description}</p>
                    </li>
                  ))}
                </ul>
              </div>
          </div>

      <div className='AllBoard'>
        <GameContext.Provider value={{ cells, setCells, places, characters }}>
          <div className="board-container">
            <img src={tablero} alt="Tablero Marco" className="board-frame" />
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
                  {characters
                    .filter(character => character.positionX === cell.x && character.positionY === cell.y)
                    .map(character => (
                      <img
                        key={character.characterId}
                        src={character["Character"].avatar}
                        alt={character.name}
                        className="character-board"
                        style={{
                          position: "absolute",
                          left: `${(character.positionX * 100) / cells.length}%`,
                          bottom: `${(character.positionY * 100) / cells.length}%`,
                          zIndex: 10,
                        }}
                      />
                    ))}
                  <img
                    src={cell.image}
                    alt={`Cell ${cell.x}, ${cell.y}`}
                    className="cell-image"
                  />
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
    </div>
  </main>
</div>


  );
  }
     