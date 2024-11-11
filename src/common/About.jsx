import '../assets/styles/about.css'

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
                        <li><a href="login.html" id="login">Iniciar Sesión</a></li>
                    </div>
                </ul>
            </nav>
        </header>
        
        <main>
            <h1 class="title-about">Acerca de Nosotros</h1>
            <p class="description">Descripcion del equipo desarrollador</p>
        </main>
    </body>
  )
}

export default About
