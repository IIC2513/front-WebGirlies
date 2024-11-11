import './cell.css'
import {useState} from "react";
import CellButton from './CellButton';


export default function Cell({imgSrc}) {
    const [showImage, setShowImage] =useState(true);
    const toggleImage =() => {
        setShowImage(!showImage);
    }
    return(
        <div className="cell">
            <div className="cell-container">
                {showImage && <img src={imgSrc} className="image"/>}
                <button className="button">
                    <CellButton onClick={toggleImage} showImage={showImage}/>
                </button>
            </div>
        </div>
    )
}