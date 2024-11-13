import styles from './Landing.module.css';
import LogoutButton from '../profile/Logout';

function LandingPage() {
  return (
    <div>
      <header className={styles.headerLan}>
        <nav>
          <ul>
            <div className={styles.links}>
              <li><a href='/'>Inicio</a></li>
              <li><a href='/about'>Nosotros</a></li>
              <li><a href='/instructions'>Como Jugar</a></li>
              <li><a href='/board'>Ir a Jugar</a></li>
              <li><a href='/login' className={styles.login}>Login</a></li>
              <li><a href='/signup'>Registro</a></li>
              <li><LogoutButton /></li>
            </div>
          </ul>
        </nav>
      </header>
      <main className={styles.landing}>
        <h1 className={styles.title}>ASESINATO EN EL HOSPITAL</h1>
        <p className={styles.description}>
          El juego es policial y gira en torno a resolver un asesinato. Habrá un impostor (o asesino) que los jugadores deberán descubrir. Los jugadores tendrán que reunir pistas e intentar resolver el crimen, descubriendo tanto lugar, como asesino y arma, pero el impostor intentará desviar la atención para que no lo descubran.
        </p>
      </main>
    </div>
  );
}

export default LandingPage;

