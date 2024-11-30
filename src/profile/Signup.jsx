import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css'; 
import room from './../assets/images/habitacion_signup.jpg';
import LogoutButton from '../profile/Logout';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';

function Signup() {
  const { token } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // Campo para avatar
  const [name, setName] = useState(""); // Campo para name
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

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
      console.log('Successful registration! Now you can log in');
      setError(false);
      setMsg('Successful registration! Now you can log in');
      
      setTimeout(() => {
        navigate('/login');
      }, 900);

    } catch (error) {
      console.error('Error:', error);
      setError(true); // aquí puede haber más lógica para tratar los errores
    }
  }

  return (
    <div className='general'>
      <Navbar />
      <main className='MainLogin'>
        <h3 className='registro'>Sign in</h3>
        {msg.length > 0 && <div className="successMsg"> {msg} </div>}
        {error && <div className="error">There was an error with the registry, please try again.</div>}
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
