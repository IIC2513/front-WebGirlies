import './Board.css';
import React, { createContext, useContext ,useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import LogoutButton from '../profile/Logout';
import tablero from '../assets/images/Tablero__final.png';

// Exporta el contexto y el componente sin usar `default`
export const GameContext = createContext(null);

export function Board() {
  const { token } = useContext(AuthContext);
  const [cells, setCells] = useState([]);
  const [places, setPlaces] = useState([]);
  

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/boards/boardData`, {
      params: { boardId: 1 }  // Pasando boardId como parámetro
    })
      .then((response) => {
        console.log(response.data["places"]);
        const data = response.data;
        setCells(response.data["boards"]["0"].cells);
        setPlaces(response.data["places"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

return (
  <div className='BodyBoard'>
    <header className="headerBoard">
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
    <main>
    <GameContext.Provider value={{ cells, setCells, places }}>
      <div className="board-container">
        <img src={tablero} alt="Tablero Marco" className="board-frame" />
        <div className="board">
          {cells.map(cell => (
            <div key={`${cell.x}-${cell.y}`} className="board-cell">
              <img
                src={cell.image}
                alt={`Cell ${cell.x}, ${cell.y}`}
                className="cell-image"
              />
            </div>
          ))}
        </div>
      </div>
    </GameContext.Provider>
    </main>
  </div>
  );
}
