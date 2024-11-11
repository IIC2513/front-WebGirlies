import '../assets/styles/instructions.css'
import board from './../assets/images/baord.jpeg'

function Instructions() {
    return (
    <body className='instructions'>
        <header>
            <div className="links"></div>
            <nav>
                <ul>
                    <div className="links">
                        <li><a href='/'>Inicio</a></li>
                        <li><a href='/about'>Nosotros</a></li>
                        <li><a href='/instructions'>Como Jugar</a></li>
                        <li><a href="login.html" id="login">Iniciar Sesión</a></li>
                    </div>
                </ul>
            </nav>
        </header>
        
        <div className="main-div">
            <div>
                <h3 className='title-instructions'>Como Jugar</h3>
                <p className="description">Aqui te explicamos la mecánica de nuestro juego <strong>Asesinato en el Hospital</strong> </p>
            </div>
            <img src={board}/>
        </div>
    </body>
    )
}

export default Instructions