import React from 'react';
import '../styles/tron-theme.css';

interface ArcadeCabinetProps {
  children: React.ReactNode;
}

export const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ children }) => {
  return (
    <div className="arcade-cabinet crt flicker">
      <div className="cabinet-glass">
        {children}
      </div>
      <div className="speaker-grille left-speaker"></div>
      <div className="speaker-grille right-speaker"></div>
      <div className="coin-return">
         <div className="coin-slot">INSERT COIN</div>
         <div className="coin-slot">INSERT COIN</div>
      </div>
    </div>
  );
};
