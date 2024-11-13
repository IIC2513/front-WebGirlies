import './CharacterSelection.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Asegura la importación de useNavigate


export function CharacterSelection() {
  const [characters, setCharacters] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/characters`)
      .then((response) => {
        setCharacters(response.data);
      })
      .catch((error) => {
        console.log("Error al obtener los personajes:", error);
      });
  }, []);

  const handleCharacterClick = async (characterId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/join`, {
        userId: 1,
        gameId: 1,
        characterId: characterId,
      });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/jugar');
      }
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
