import './CharacterSelection.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';

export function CharacterSelection() {
  const [characters, setCharacters] = useState([]);
  const [message, setMessage] = useState("");
  console.log("entre a character selection")

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/characters`)
      .then((response) => {
        setCharacters(response.data);
        console.log("Personajes obtenidos:", response.data);
      })
      .catch((error) => {
        console.log("Error al obtener los personajes:", error);
      });
  }, []);

  const handleCharacterClick = async (characterId) => {
    console.log(characterId)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/join`, {
        userId: 2,
        gameId: 1,
        characterId: characterId,
      });
      console.log("Personaje seleccionado:", response.data);
      setMessage(response.data.message);
    } catch (error) {
      console.log("Error al seleccionar el personaje:", error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="character-selection">
    <header>
            <div className="links"></div>
            <nav>
                <ul>
                    <div className="links">
                        <li><a href='/'>Inicio</a></li>
                        <li><a href='/about'>Nosotros</a></li>
                        <li><a href='/instructions'>Como Jugar</a></li>
                        <li><a href='/board'>Ir a Jugar</a></li>
                        <li><a href="login.html" id="login">Iniciar Sesión</a></li>
                        {message && <div className="message">{message}</div>} 
                    </div>
                </ul>
            </nav>
        </header>
    <div className="character-grid">
      {characters.map((character, index) => (
        <div key={index} className="character-card"
        onClick={() => handleCharacterClick(character.characterId)} // Evento onClick para enviar la solicitud POST
        >
          <img src={character.avatar} alt={`${character.name} avatar`} className="character-avatar" />
          <h2>{character.name}</h2>
          <p>Edad: {character.age}</p>
          <p>Objeto distintivo: {character.distinctiveItem}</p>
          <p>{character.description}</p>
        </div>
      ))}
    </div>
  </div>
  );
}
