import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css'; 
import room from './../assets/images/habitacion_signup.jpg';
import LogoutButton from '../profile/Logout';

function Signup() {
  const { token } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // Campo para avatar
  const [name, setName] = useState(""); // Campo para name
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        username,
        email,
        password,
        avatar,
        name
      });
      console.log('Registro exitoso! Ahora puedes volver y loguearte');
      setError(false);
      setMsg('Successful registration! Now you can go back and log in');
    } catch (error) {
      console.error('Ocurrió un error:', error);
      setError(true); // aquí puede haber más lógica para tratar los errores
    }
  }

  return (
    <div className='general'>
      <header className="headerLogin">
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
                <li><LogoutButton /></li>
              )}
            </div>
          </ul>
        </nav>
      </header>
      <main className='MainLogin'>
        <h3 className='registro'>Sign in</h3>
        {msg.length > 0 && <div className="successMsg"> {msg} </div>}
        {error && <div className="error">There was an error with the Registry, please try again.</div>}
        <div className="Login">
          <img src={room} alt="Room" className="login-image" />
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <input 
                placeholder='Username'
                type="text" 
                name="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              <input 
                placeholder='Full Name'
                type="text" 
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label>
              <input 
                placeholder='Avatar URL'
                type="text" 
                name="avatar"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              />
            </label>
            <label>
              <input 
                placeholder='Email'
                type="email" 
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <input 
                placeholder='Password'
                type="password" 
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
            <input type="submit" value="Create my account" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signup;
