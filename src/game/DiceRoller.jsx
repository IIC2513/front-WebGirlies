import React from "react";
import "./DiceRoller.css";

const DiceRoller = ({ diceValue }) => {
  return (
    <div className="dice-roller-body">
      <div className="dice-roller-game">
        <div className="dice-roller-container">
          {/* Single Dice */}
          <div id="dice1" className={`dice-roller-dice dice-roller-show-${diceValue}`}>
            <div className="dice-roller-side">
              <div className="dice-roller-dot dice-roller-one-1"></div>
            </div>
            <div className="dice-roller-side">
              <div className="dice-roller-dot dice-roller-two-1"></div>
              <div className="dice-roller-dot dice-roller-two-2"></div>
            </div>
            <div className="dice-roller-side">
              <div className="dice-roller-dot dice-roller-three-1"></div>
              <div className="dice-roller-dot dice-roller-three-2"></div>
              <div className="dice-roller-dot dice-roller-three-3"></div>
            </div>
            <div className="dice-roller-side">
              <div className="dice-roller-dot dice-roller-four-1"></div>
              <div className="dice-roller-dot dice-roller-four-2"></div>
              <div className="dice-roller-dot dice-roller-four-3"></div>
              <div className="dice-roller-dot dice-roller-four-4"></div>
            </div>
            <div className="dice-roller-side">
              <div className="dice-roller-dot dice-roller-five-1"></div>
              <div className="dice-roller-dot dice-roller-five-2"></div>
              <div className="dice-roller-dot dice-roller-five-3"></div>
              <div className="dice-roller-dot dice-roller-five-4"></div>
              <div className="dice-roller-dot dice-roller-five-5"></div>
            </div>
            <div className="dice-roller-side">
              <div className="dice-roller-dot dice-roller-six-1"></div>
              <div className="dice-roller-dot dice-roller-six-2"></div>
              <div className="dice-roller-dot dice-roller-six-3"></div>
              <div className="dice-roller-dot dice-roller-six-4"></div>
              <div className="dice-roller-dot dice-roller-six-5"></div>
              <div className="dice-roller-dot dice-roller-six-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;