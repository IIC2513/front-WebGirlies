import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css';
import pasillo from './../assets/images/pasillo-oscuro-hospital-salida-emergencia-luz-encima.jpg';
import LogoutButton from '../profile/Logout';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';

function Login() {
  const { token, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email: email,
        password: password
      }).then((response) => {
        console.log('Login successful');
        setError(false);
        setMsg("Login successful!");

        // Recibimos el token y lo procesamos
        const access_token = response.data.access_token;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        console.log("Se seteo el token: ", token);

        setTimeout(() => {
          navigate('/play');
        }, 2000);

      }).catch((error) => {
        console.error('An error occurred while trying to login:', error);
        setError(true);// aquí puede haber más lógica para tratar los errores
      })
  };

  return (
    <div className='general'>
      <Navbar />
      <main className='MainLogin'>
        <h3 className='registro'>Login</h3>
        {msg.length > 0 && <div className="successMsg"> {msg} </div>}
        {error && <div className="error">There was an error with the login, please try again.</div>}
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