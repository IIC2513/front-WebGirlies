import '../assets/styles/landing.css'

function LandingPage() {

  return (
  <body className='landing'>
    <header>
      <div class="links"></div>
      <nav>
        <ul>
          <div class="links">
            <li><a href='/'>Inicio</a></li>
            <li><a href='/about'>Nosotros</a></li>
            <li><a href='/instructions'>Como Jugar</a></li>
            <li><a href="login.html" id="login">Iniciar Sesión</a></li>
          </div>
        </ul>
      </nav>
    </header>
    
    <main>
      <h1 class="title" id="game-title">ASESINATO EN EL HOSPITAL</h1>
      <h3 class="title">Tecnología y Aplicaciones Web Edition</h3>
      <p class="description">El juego es policial y gira en torno a resolver un asesinato. 
          Habrá un impostor (o asesino) que los jugadores deberán descubrir. Los jugadores 
          tendrán que reunir pistas e intentar resolver el crimen, descubriendo tanto lugar, 
          como asesino y arma, pero el impostor intentará desviar la atención para que no lo descubran.</p>
    </main>
  </body>
  )
}

export default LandingPage
