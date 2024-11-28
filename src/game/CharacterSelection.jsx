import './CharacterSelection.css';
import React, { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import axios from 'axios';
import Navbar from '../common/Navbar';
import { useParams, useLocation } from 'react-router-dom';

export function CharacterSelection() {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [message, setMessage] = useState("");

  // Obtener la ubicación actual de la URL
  const location = useLocation();
  
  // Extraer los parámetros de consulta de la URL
  const params = new URLSearchParams(location.search);
  const gameId = params.get('gameId'); // Obtienes el valor de 'gameId' de la URL
  
  // Decodificar el token y obtener el userId
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  const userId = payload.sub || null;

  console.log("userId:", userId);
  console.log("gameId:", gameId); // Verifica si gameId se obtiene correctamente

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/characters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setCharacters(response.data);
      })
      .catch((error) => {
        console.log("Error al obtener los personajes:", error);
      });
  }, [token]);

  const handleCharacterClick = (characterId) => {
    setSelectedCharacterId(characterId);
  };

  const handleConfirmSelection = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/games/join`,
        {
          userId: userId, // Ajusta con el usuario autenticado
          gameId: gameId, // Usar el gameId de los parámetros
          characterId: selectedCharacterId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.log("Error al seleccionar el personaje:", error);
      setMessage(error.response?.data?.message || "Error desconocido");
    }
  };

  return (
    <div className="Bodycharacter-selection">
      <Navbar />
      <div id="conteiner-selectbutton">
        <button
          className="confirm-button"
          onClick={handleConfirmSelection}
          disabled={!selectedCharacterId}
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
            }`}
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
