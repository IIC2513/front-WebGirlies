import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios, { all } from 'axios';
import { AuthContext } from '../auth/AuthContext';
import tablero from '../assets/images/Tablero__final.png';
import Navbar from '../common/Navbar';
import { useParams } from 'react-router-dom';
import DiceRoller from './DiceRoller';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Dashboard from "./Dashboard";

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
  console.log("boardId:", boardId);

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
  const [userId, setUserId] = useState(payload.sub);
  const [accusation, setAccusation] = useState({ haracterId: null, weaponId: null, placeId: null});
  const [showAccusePopup, setShowAccusePopup] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [accuseResult, setAccuseResult] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);
  const [allWeapons, setAllWeapons] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);

  console.log("boardId:", boardId);

  const handleCard = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/getClue`, {
        userId: userId, 
        gameId: boardId,
      });
      console.log(`Éxito: ${response.data.message}`);
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      console.log('Hubo un problema al conectar con el servidor.');
    }
  };

  const handlePopup = () => {
    setShowPopup(!showPopup); // Alternar visibilidad del popup
    setPopupContent('Aquí puedes escribir o ver tus notas.'); // Cambia el contenido según lo necesites
  };
  const handleNoteChange = (event) => {
    setNote(event.target.value); // Actualiza el contenido de la nota
  };
  const handleAccuse = () => {
    setShowAccusePopup(true); // Mostrar el popup de acusación
  };
  const sendAccusation = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/accuse`, {
        userId,
        gameId: boardId,
        accusation,
      });
      setGameId(boardId)
      setAccuseResult(response.data); // Mostrar el resultado devuelto por el backend
      setShowAccusePopup(false); // Cierra el popup de selección
    } catch (error) {
      console.error('Error al enviar la acusación:', error);
      setAccuseResult({ message: 'Error al enviar la acusación.' });
    }
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes/${gameId}/${userId}`);
      setNote(response.data.notes); // Actualiza el estado con la nota obtenida
    } catch (error) {
      console.error('Error al obtener la nota:', error);
    }
  };
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/getData`);
      console.log("Datos obtenidos de /games/getData:", response.data);
      setAllWeapons(response.data.weapons);
      console.log("Armas:", allWeapons);
      setAllCharacters(response.data.characters);
      console.log("Personajes:", allCharacters);
      setAllPlaces(response.data.places);
      console.log("Lugares:", allPlaces);
    } catch (error) {
      console.error("Error al obtener datos de /games/getData:", error);
    }
  };
  
  useEffect(() => {
    fetchAllData();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    const initializeData = () => {
      setCells([]);
      setPlaces([]);
      setCards([]);
      setCharacters([]);
      setAbilities([]);
      setUserId(payload.sub);
      setAllCharacters([]);
      setAllWeapons([]);
      setAllPlaces([]);
      setGameId(boardId);
    };
  
    initializeData();
  }, []);

  
  const moveCharacter = async (targetX, targetY) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/move`, {
        userId: userId,
        gameId: boardId,
        targetX,
        targetY,
      });
  
      if (response && response.data) {
        // Actualiza el personaje con la nueva posición

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
    fetchAllData();
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: boardId, userId: userId }
    })
      .then((response) => {
        const sortedCells = response.data["boards"]["0"].cells.sort((a, b) => a.id - b.id);
        const numericUserId = Number(userId); // Realiza esta conversión al inicio
        const myCharacters = response.data.character.find(
          character => character.User.userId === numericUserId
        );
        setMyCharacter(myCharacters);
        setMyRole(myCharacters.role);
        setCells(sortedCells);
        setPlaces(response.data["places"]);
        setCards(response.data["cards"]);
        setCharacters(response.data["character"]); // Asegúrate de que aquí se está actualizando correctamente
        setAbilities(response.data.abilities);
        setMyCards(response.data["MyCards"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [boardId, userId]);  // Depende de boardId y userId para recargar cuando cambien
  

  useEffect(() => {
    // Llama a la función para obtener las notas al cargar la página
    fetchNote();
  }, [boardId, userId]);
  

return (
  <div className='BodyBoard'>
    <Navbar />
    <main className='MainBoard'>
      <div className='contenedor-board-dashboard'>
        <div className='contenedor-dashboard'>
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
                  <p id="username-board">{character.User.username}</p>
                </div>
              ))}
          </div>
          <div className='contenedor-dado'>
            <div className="contenedor-mi-personaje">
              {myCharacter && (
                <div className="mi-personaje">
                  <img 
                    src={myCharacter.Character.avatar} 
                    alt={myCharacter.Character.name} 
                    className="mi-personaje-avatar" 
                  />
                  <p className="mi-personaje-nombre">My Role {myRole}</p>
                </div>
              )}
            </div>
            <button className='dice-roller-button' onClick={rollDice}>Roll Dice</button>
            {diceValue !== null && <DiceRoller diceValue={diceValue} />}
          </div>
          <div>
            {/* Botón para mostrar/ocultar el popup */}
            <button className='popup-toggle-button' onClick={() => { console.log('Botón de notas clickeado'); handlePopup(); }}>
              Notas
            </button>
            {/* Popup que se muestra al lado del dado */}
            {showPopup && (
              <div className="popup" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="popup-content">
                  <button className="close-button" onClick={handlePopup}>x</button>
                  <textarea
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Escribe tus notas aquí..."
                    rows={5}
                    className='text-notas'
                  />
                  <button onClick={saveNote}>Guardar Nota</button>
                </div>
              </div>
            )}
          </div>
          <div>
            <button onClick={handleAccuse}>
              Acusse
            </button>
            {showAccusePopup && (
              <div className="popup" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="popup-content">
                  <button className="close-button" onClick={() => setShowAccusePopup(false)}>X</button>
                  <h3>Realizar acusación</h3>
                  <div>
                    <h4>Selecciona un personaje</h4>
                    {allCharacters.map((character) => (
                      <label key={character.characterId}>
                        <input
                          type="radio"
                          name="character"
                          value={character.characterId}
                          onChange={() =>
                            setAccusation((prev) => ({ ...prev, characterId: character.characterId }))
                          }
                        />
                        {character.card.description}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4>Selecciona un arma</h4>
                    {allWeapons
                      .map((weapon) => (
                        <label key={weapon.cardId}>
                          <input
                            type="radio"
                            name="weapon"
                            value={weapon.cardId}
                            onChange={() =>
                              setAccusation((prev) => ({ ...prev, weaponId: weapon.cardId }))
                            }
                          />
                          {weapon.card.description}
                        </label>
                      ))}
                  </div>
                  <div>
                    <h4>Selecciona un lugar</h4>
                    {allPlaces.map((place) => (
                      <label key={place.placeId}>
                        <input
                          type="radio"
                          name="place"
                          value={place.placeId}
                          onChange={() =>
                            setAccusation((prev) => ({ ...prev, placeId: place.placeId }))
                          }
                        />
                        {place.card.description}
                      </label>
                    ))}
                  </div>
                  <button onClick={sendAccusation}>Enviar Acusación</button>
                </div>
              </div>
            )}
            {accuseResult && (
              <div className="popup" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="popup-content">
                  <button className="close-button" onClick={() => setAccuseResult(null)}>X</button>
                  <h3>Resultado de la acusación</h3>
                  <p>{accuseResult.message}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <button onClick={handleCard}>
              Recoger carta
            </button>
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
     