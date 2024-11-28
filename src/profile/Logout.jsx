import React, {useContext, useState} from 'react';
import './Login.css';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';


const LogoutButton = () => {
  const {logout} = useContext(AuthContext);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMsg("Has hecho logout con éxito!");
    navigate("/");
  }

  return (
    <>
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}
      <button onClick={handleLogout}>
          Log out
      </button>
    </>
  );
}

export default LogoutButton;