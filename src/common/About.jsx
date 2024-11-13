import '../assets/styles/about.css';
import LogoutButton from '../profile/Logout';

function About() {
    return (
    <body className='about'>
        <header>
            <div class="links"></div>
            <nav>
                <ul>
                    <div class="links">
                        <li><a href='/'>Inicio</a></li>
                        <li><a href='/about'>Nosotros</a></li>
                        <li><a href='/instructions'>Como Jugar</a></li>
                        <li><a href='/board'>Ir a Jugar</a></li>
                        <li><a href='/login' >Login</a></li>
                        <li><a href='/signup'>Registro</a></li>
                        <li><LogoutButton /></li>
                    </div>
                </ul>
            </nav>
        </header>
        
        <main>
            <h1 class="title-about">Acerca de Nosotros</h1>
            <p class="description">Somos un equipo de especialistas con amplio conocimiento en la industria de los videojuegos.
                Queremos que todos puedan disfrutar de nuestro juego.
            </p>
        </main>
    </body>
  )
}

export default About
