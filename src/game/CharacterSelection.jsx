import './CharacterSelection.css';
import React, { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import axios from 'axios';
import LogoutButton from '../profile/Logout';

export function CharacterSelection() {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
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

  const handleCharacterClick = async (characterId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games/join`, {
        userId: 1,
        gameId: 1,
        characterId: characterId,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.log("Error al seleccionar el personaje:", error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="Bodycharacter-selection">
      <header className="headerCharacter">
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
                  <li id="login"><a href='/login' >Login</a></li>
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
      <div className="character-grid">
        {characters.map((character, index) => (
          <div key={index} className="character-card"
          onClick={() => handleCharacterClick(character.characterId)} // Evento onClick para enviar la solicitud POST
          >
            <img src={character.avatar} alt={`${character.name} avatar`} className="character-avatar" />
            <div className='character-description'>
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
