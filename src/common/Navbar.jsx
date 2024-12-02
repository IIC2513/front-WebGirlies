import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import LogoutButton from '../profile/Logout';
import './Navbar.css';

const Navbar = () => {
  const { token } = useContext(AuthContext);

  return (
    <header className="headerNav">
      <nav>
        <ul>
          <div className="links">
            <li><a href="/">Start</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/instructions">How to play</a></li>
            {!token ? (
              <>
                <li id="login"><a href="/login">Login</a></li>
                <li id="signup"><a href="/signup">Sign up</a></li>
              </>
            ) : (
              <>
                <li><a href='/myGames'>My Games</a></li>
                <li><a href="/allGames">All Games</a></li>
                <li><LogoutButton /></li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
