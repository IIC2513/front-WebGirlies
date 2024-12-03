import './CharacterSelection.css';
import React, { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import axios from 'axios';
import Navbar from '../common/Navbar';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import VITE_BACKEND_URL from "../config";

export function CharacterSelection() {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook para redirigir

  // Obtener la ubicación actual de la URL
  const location = useLocation();
  
  const previousPage = location.state?.from || '/myGames';
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
    axios.get(`${VITE_BACKEND_URL}/characters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setCharacters(response.data);
      })
      .catch((error) => {
        console.log("Error fetching characters:", error);
      });
  }, [token]);

  const handleCharacterClick = (characterId) => {
    setSelectedCharacterId(characterId);
  };

  const handleConfirmSelection = async () => {
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/games/join`,
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

      // Condición para no redirigir si el mensaje contiene "already" o "error"
      if (response.data.message.toLowerCase().includes("already") || response.data.message.toLowerCase().includes("error")) {
        console.log("No se redirige debido a un mensaje de advertencia o error.");
      } else {
        setTimeout(() => {
          navigate(previousPage);
        }, 500);
      }

      setMessage(response.data.message);

    } catch (error) {
      console.log("Error selecting character:", error);
      setMessage(error.response?.data?.message || "Unknown error");
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
            message.toLowerCase().includes("already") || message.toLowerCase().includes("error")
              ? "error"
              : "success"
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
