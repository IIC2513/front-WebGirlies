import "./Board.css"
import Cell from "./Cell"
import img1 from '../assets/images/baord.jpeg';

export default function Board() {
    const cells = [
        { id: 1, imgSrc: img1 },
        { id: 2, imgSrc: img1 },
        { id: 3, imgSrc: img1 }
    ];
    return(
        <body>
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
                    {cells.slice(0, 2).map(cell=> (
                    <Cell key={cell.id} imgSrc={cell.imgSrc}/>
                    ))}
                </div>
                <div className="board-row">
                    <Cell key={cells[2].id} imgSrc={cells[2].imgSrc}/>
                    <Cell key={cells[2].id} imgSrc={cells[2].imgSrc}/>
                </div>
            </div>
        </body>
    )
}