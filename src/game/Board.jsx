import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios, { all } from 'axios';
import { AuthContext } from '../auth/AuthContext';
import tablero from '../assets/images/Tablero__final.png';
import Navbar from '../common/Navbar';
import { useParams } from 'react-router-dom';
import DiceRoller from './DiceRoller';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import card_image from '../assets/images/carta_imagen.png';
import VITE_BACKEND_URL from "../config";

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
  const [userId, setUserId] = useState(payload.sub);
  const [accusation, setAccusation] = useState({ haracterId: null, weaponId: null, placeId: null});
  const [showAccusePopup, setShowAccusePopup] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [accuseResult, setAccuseResult] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);
  const [allWeapons, setAllWeapons] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);

  const navigate = useNavigate();

  const handleCard = async () => {
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/games/getClue`, {
        userId: userId, 
        gameId: boardId,
      });
      console.log(`Éxito: ${response.data.message}`);
  
      // Agregar la carta al estado de `myCards`
      console.log("Cartas antes:", myCards);
      console.log("Carta recogida:", response.data.card);
  
      // Aquí actualizas las cartas y no necesitas recargar la página
      setMyCards(prevCards => {
        const updatedCards = [...prevCards, response.data.card];
        console.log("Cartas actuales:", updatedCards); // Muestra las cartas después de la actualización
        return updatedCards;
      });
  
      // Mostrar un mensaje o notificación de éxito
      console.log(`¡Has recogido una carta: ${response.data.card.description || 'sin nombre'}!`);
      alert(`¡Has recogido una carta: ${response.data.card.Card.description || 'sin nombre'}!`);
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      alert('Hubo un problema al recoger la carta.');
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
      const response = await axios.post(`${VITE_BACKEND_URL}/games/accuse`, {
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
      const response = await axios.patch(`${VITE_BACKEND_URL}/notes/${boardId}/${userId}`, {
        notes: note, // Envía la nueva nota al backend
      });
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
      const response = await axios.get(`${VITE_BACKEND_URL}/notes/${boardId}/${userId}`);
      setNote(response.data.notes); // Actualiza el estado con la nota obtenida
    } catch (error) {
      console.error('Error al obtener la nota:', error);
    }
  };

  
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${VITE_BACKEND_URL}/games/getData`);
      setAllWeapons(response.data.weapons);
      setAllCharacters(response.data.characters);
      setAllPlaces(response.data.places);
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
      const response = await axios.post(`${VITE_BACKEND_URL}/games/move`, {
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
        setIsInAPlace(response.data.isInAPlace); // Actualiza el estado de isInAPlace
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
        const response = await axios.get(`${VITE_BACKEND_URL}/games/dice`, {
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
    fetchAllData();
    axios.get(`${VITE_BACKEND_URL}/boards/boardData`, {
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
        console.log("MyCards al inicio:", myCards);
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
                  <p className="mi-personaje-nombre">My Character</p>
                </div>
              )}
            </div>
            <button className='dice-roller-button' onClick={rollDice}>Roll Dice</button>
            {diceValue !== null && <DiceRoller diceValue={diceValue} />}
          </div>
          <div className='two-button'>
            {/* Botón para mostrar/ocultar el popup */}
            <button className='popup-toggle-button' onClick={() => { console.log('Botón de notas clickeado'); handlePopup(); }}>
              Notes
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
                  <button onClick={saveNote}>Save note</button>
                </div>
              </div>
            )}
          
            <button className='popup-toggle-button' onClick={handleAccuse}>
              Accuse
            </button>
            {showAccusePopup && (
              <div className="popup" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="popup-content">
                  <button className="close-button" onClick={() => setShowAccusePopup(false)}>x</button>
                  <h2>Make accusation</h2>
                  <div className='contenedor-preguntas'>
                    <div>
                      <h4>Select a character</h4>
                      <div className="character-list">
                        {allCharacters.map((character) => (
                          <label key={character.Card.cardId} className="character-option">
                            <input
                              type="radio"
                              name="character"
                              value={character.id}
                              onChange={() =>
                                setAccusation((prev) => ({ ...prev, characterId: character.Card.cardId }))
                              }
                            />
                            {character.Card.description}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4>Select a weapon</h4>
                      <div className="weapon-list">
                        {allWeapons.map((weapon) => (
                          <label key={weapon.id} className="weapon-option">
                            <input
                              type="radio"
                              name="weapon"
                              value={weapon.Card.cardId}
                              onChange={() =>
                                setAccusation((prev) => ({ ...prev, weaponId: weapon.Card.cardId }))
                              }
                            />
                            {weapon.Card.description}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4>Select a place</h4>
                      <div className="place-list">
                        {allPlaces.map((place) => (
                          <label key={place.id} className="place-option">
                            <input
                              type="radio"
                              name="place"
                              value={place.Card.placeId}
                              onChange={() =>
                                setAccusation((prev) => ({ ...prev, placeId: place.Card.cardId }))
                              }
                            />
                            {place.Card.description}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={sendAccusation}>Submit Accusation</button>
                </div>
              </div>
            )}
            {accuseResult && (
              <div className="popup" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="popup-content">
                  <button 
                    className="close-button" 
                    onClick={() => {
                      setAccuseResult(null); // Limpia el estado
                      navigate('/allgames'); // Redirige a la página 'allgames'
                    }}
                  >
                    x
                  </button>
                  <h3>Result of the accusation</h3>
                  <p>{accuseResult.message}</p>
                </div>
              </div>
            )}
          </div>
          <div>
          {isInAPlace  && (
              <button onClick={handleCard} className='popup-toggle-button' id="pick-card">
                Pick up card
              </button>
            )}
            <h2>My Cards</h2>
            <div className="card-container">
              {myCards.map((card) => (
                <div key={card.id} className="card-dashboard">
                  <img 
                    src={card["Card"].image} 
                    className="card-image-dashboard"
                  />
                  <p>{card["Card"].description}</p>
                </div>
              ))}
            </div>
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
                              src={card_image}
                              alt={card.name}
                              className="card-image"
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
     