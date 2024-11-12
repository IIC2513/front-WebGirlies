import styles from '../assets/styles/landing.module.css'

function LandingPage() {

  return (
  <body className={styles.landing}>
    <header>
      <div className={styles.links}></div>
      <nav>
        <ul>
          <div class="links">
            <li><a href='/'>Inicio</a></li>
            <li><a href='/about'>Nosotros</a></li>
            <li><a href='/instructions'>Como Jugar</a></li>
            <li><a href='/board'>Ir a Jugar</a></li>
            <li><a href="login.html" id="login">Iniciar Sesión</a></li>
          </div>
        </ul>
      </nav>
    </header>
    
    <h1 className={styles.title}>ASESINATO EN EL HOSPITAL</h1>
    <p className={styles.description}>El juego es policial y gira en torno a resolver un asesinato. 
        Habrá un impostor (o asesino) que los jugadores deberán descubrir. Los jugadores 
        tendrán que reunir pistas e intentar resolver el crimen, descubriendo tanto lugar, 
        como asesino y arma, pero el impostor intentará desviar la atención para que no lo descubran.</p>
  </body>
  )
}

export default LandingPage
