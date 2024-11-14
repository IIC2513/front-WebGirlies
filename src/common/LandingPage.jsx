import styles from './Landing.module.css';
import LogoutButton from '../profile/Logout';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 

function LandingPage() {
  const { token } = useContext(AuthContext);

  return (
    <div>
      <header className={styles.headerLan}>
        <nav>
          <ul>
            <div className={styles.links}>
              <li><a href='/'>Start</a></li>
              <li><a href='/about'>About us</a></li>
              <li><a href='/instructions'>How to play</a></li>
              <li><a href='/board'>Play</a></li>

              {/* Mostrar Login y Sign Up solo si no hay token */}
              {!token ? (
                <>
                  <li id={styles.login}><a href='/login' >Login</a></li>
                  <li id={styles.signup}><a href='/signup'>Sign up</a></li>
                </>
              ) : (
                // Mostrar Logout si hay un token (usuario logueado)
                <li><LogoutButton /></li>
              )}
            </div>
          </ul>
        </nav>
      </header>
      <div className={styles.MainLanding}>
        <h1 className={styles.title}>Murder in the hospital</h1>
        <div className={styles.description}>
          <p>
          Police game that revolves around solving a murder. There will be an impostor/murderer that players must discover. Players will have to gather clues and try to solve the crime, discovering both the location, the murderer and the weapon, but the impostor will try to divert attention so that he is not discovered.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


