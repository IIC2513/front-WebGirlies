import './CharacterSelection.css';
import React, { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import axios from 'axios';
import Navbar from '../common/Navbar';

export function CharacterSelection() {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null); // Estado para el personaje seleccionado
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/characters`)
      .then((response) => {
        setCharacters(response.data);
      })
      .catch((error) => {
        console.log("Error al obtener los personajes:", error);
      });
  }, []);

  const handleCharacterClick = (characterId) => {
    setSelectedCharacterId(characterId); // Actualiza el personaje seleccionado
  };

  const handleConfirmSelection = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/games/join`,
        {
          userId: 1,
          gameId: 1,
          characterId: selectedCharacterId, // Usa el ID del personaje seleccionado
        }
      );
      setMessage(response.data.message); // Muestra el mensaje de éxito
    } catch (error) {
      console.log("Error al seleccionar el personaje:", error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="Bodycharacter-selection">
      <Navbar />
      <div id ='conteiner-selectbutton'>
        <button
          className="confirm-button"
          onClick={handleConfirmSelection}
          disabled={!selectedCharacterId} // Deshabilita si no hay selección
        >
          Select
        </button>
      </div>
      {message.length > 0 && (
        <div
          className={`message ${
            message.toLowerCase().includes("éxito") || message.toLowerCase().includes("success")
              ? "success"
              : "error"
          }`}
        >
          {message}
        </div>
      )}
      <div className="character-grid">
        {characters.map((character) => (
          <div
            key={character.characterId}
            className={`character-card ${
              selectedCharacterId === character.characterId ? "selected" : ""
            }`} // Aplica clase "selected" si está seleccionado
            onClick={() => handleCharacterClick(character.characterId)}
          >
            <img
              src={character.avatar}
              alt={`${character.name} avatar`}
              className="character-avatar"
            />
            <div className="character-description">
              <h2>{character.name}</h2>
              <p>Edad: {character.age}</p>
              <p>Objeto distintivo: {character.distinctiveItem}</p>
              <p>{character.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
