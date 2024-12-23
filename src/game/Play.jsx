import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../common/Navbar';
import './Play.css';
import VITE_BACKEND_URL from "../config";

const Play = () => {
  const { token } = useContext(AuthContext); // Para verificar si el usuario está logueado
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/games/create`,
        { ownerId: 1 }, // Ajusta `ownerId` según tu implementación
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token si es necesario
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log('Game successfully created');
        navigate('/character'); // Redirige a la selección de personaje
      }
    } catch (error) {
      console.error('Error creating game:', error);
      // Puedes mostrar un mensaje de error aquí si es necesario
    }
  };

  return (
    <div className="BodyPlay">
      <Navbar />
      <main className="play-main">
        {!token ? (
          <div className="alert">
            <h2>In order to play, you have to log in</h2>
            <button onClick={() => navigate('/login')}>Log in</button>
          </div>
        ) : (
          <div className="play-actions">
            <h2>Welcome! You're all set to start playing</h2>
            <button onClick={handleCreateGame}>Create game</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Play;
