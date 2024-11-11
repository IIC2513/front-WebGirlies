import styles from './board.module.css'
import Cell from "./Cell"

export default function Board() {
    const cells = [
        {id:1, imgSrc: '../assets/images/board'}, /*cambiar una vez tengamos las imagenes de los cuartos*/
        {id:2, imgSrc: '../assets/images/board'}, /*cambiar una vez tengamos las imagenes de los cuartos*/
        {id:3, imgSrc: '../assets/images/board'}, /*cambiar una vez tengamos las imagenes de los cuartos*/
    ]
    return(
        <body className={styles.boardBody}>
            <p className={styles.descripction}>PRUEBA</p>
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
            
            <div className="board">
                <div className="board-row">
                    {cells.slice(0,2).map(cell=> (
                        <Cell key={cell.id} imgSrc={cell.imgSrc}/>
                    ))}
                </div>
                <div className="board-row">
                    <Cell key={cell[2].id} imgSrc={cell[2].imgSrc}/>
                </div>
            </div>
        </body>
    )
}