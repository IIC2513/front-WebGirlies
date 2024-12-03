import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css'; 
import room from './../assets/images/habitacion_signup.jpg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import VITE_BACKEND_URL from "../config";

function Signup() {
  const { token } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // Campo para avatar
  const [name, setName] = useState(""); // Campo para name
  const [error, setError] = useState(""); //prueba
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/signup`, {
        username,
        email,
        password,
        avatar,
        name
      });
  
      console.log('Successful registration! Now you can log in');
      setError(""); // Limpiar errores anteriores
      setMsg('Successful registration! Now you can log in');
      
      setTimeout(() => {
        navigate('/login');
      }, 900);
  
    } catch (err) {
      console.error('Error:', err);
  
      // Capturar el mensaje del backend si existe
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className='general'>
      <Navbar />
      <main className='MainLogin'>
        <h3 className='registro'>Sign up</h3>
        {msg.length > 0 && <div className="successMsg"> {msg} </div>}
        {error && <div className="error">{error}</div>}
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
