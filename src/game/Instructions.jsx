import styles from './instructions.module.css'
import board from './../assets/images/baord.jpeg'

function Instructions() {
    return (
    <body className={styles.instructions}>
        <header>
            <div className="links"></div>
            <nav>
                <ul>
                    <div className="links">
                        <li><a href='/'>Inicio</a></li>
                        <li><a href='/about'>Nosotros</a></li>
                        <li><a href='/instructions'>Como Jugar</a></li>
                        <li><a href='/board'>Ir a Jugar</a></li>
                        <li><a href="login.html" id="login">Iniciar Sesión</a></li>
                    </div>
                </ul>
            </nav>
        </header>
        
        <div className={styles.main}>
            <div>
                <h3 className={styles.title}>Como Jugar</h3>
                <p className={styles.subtitle}><strong>Inicio del Juego</strong></p>
                <li className={styles.description}>Cada jugador recibe su rol en secreto y tiene la oportunidad de seleccionar su avatar. </li>
                <li className={styles.description}>El juego inicia con todos los juagadores en el centro del tablero y las pistas y tareas repartidas por las habitaciones.</li>
                <li className={styles.description}>Se le entrega una carta item a cada jugador.</li>
                <p className={styles.subtitle}><strong>Desarrollo del Juego</strong></p>
                <li className={styles.description}>Los jugadores toman turnos de manera secuencial.</li>
                <li className={styles.description}>Los jugadores van recolectando cartas que deben llevar al centro para darlas a conocer a los demas jugadores.</li>
                <li className={styles.description}>Cada jugador es capaz de descartar y anotar las pistas que considera que son reales/falsas 
                    en base a sus suposiciones e información previa.</li>
                <p className={styles.subtitle}><strong>Fin del Juego</strong></p>
                <li className={styles.description}>El juego termina cuando se cumple alguna de las siguientes condiciones:
                    <li className={styles.description}>Los jugadores inocentes ganan si revelan la identidad del impostor o llevan todas las tareas al centro del tablero.</li>
                    <li className={styles.description}>El impostor gana si permaneces sin ser descubierto hasta el final del juego.</li>
                </li>

            </div>
            <img src={board}/>
        </div>

    </body>
    )
}

export default Instructions