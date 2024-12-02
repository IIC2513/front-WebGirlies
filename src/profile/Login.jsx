import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css';
import pasillo from './../assets/images/pasillo-oscuro-hospital-salida-emergencia-luz-encima.jpg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';

function Login() {
  const { token, setToken , setUserId} = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); //prueba
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email,
        password
      });
  
      console.log('Login successful');
      setError(""); // Limpiar errores anteriores
      setMsg("Login successful!");
  
      const access_token = response.data.access_token;
      localStorage.setItem('token', access_token);
      setToken(access_token);
  
      const user_id = response.data.user_id;
      setUserId(user_id);
  
      setTimeout(() => {
        navigate('/');
      }, 500);
  
    } catch (err) {
      console.error('An error occurred while trying to login:', err);
  
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
        <h3 className='registro'>Login</h3>
        {msg.length > 0 && <div className="successMsg"> {msg} </div>}
        {error && <div className="error">{error}</div>}
        <div className="Login">
          <img src={pasillo} alt="Pasillo" className="login-image" />
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
            <input type="submit" value="Login" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;