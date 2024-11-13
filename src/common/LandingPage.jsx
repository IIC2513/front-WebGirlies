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
      <div className={styles.landing}>
        <h1 className={styles.title}>Murder in the hospital</h1>
        <div className={styles.description}>
          <p>
            Juego policial que gira en torno a resolver un asesinato. Habrá un impostor/asesino que los jugadores deberán descubrir. Los jugadores tendrán que reunir pistas e intentar resolver el crimen, descubriendo tanto lugar, como asesino y arma, pero el impostor intentará desviar la atención para que no lo descubran.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


