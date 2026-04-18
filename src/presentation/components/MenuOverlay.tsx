import { useState } from 'react';
import type { Difficulty, OpponentType } from '../../core/domain/entities/GameState';

interface MenuOverlayProps {
  onStart: (difficulty: Difficulty, opponent: OpponentType) => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ onStart }) => {
  const [phase, setPhase] = useState<'START' | 'DIFFICULTY' | 'OPPONENT'>('START');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('DEFAULT');

  const difficulties: Difficulty[] = ['DEFAULT', 'HARD', 'GRID'];
  const opponents: { type: OpponentType, label: string }[] = [
    { type: 'RANDOM_PROGRAM', label: 'RANDOM PROGRAM' },
    { type: 'CLU', label: 'CLU (AGGRESSIVE)' },
    { type: 'RINZLER', label: 'RINZLER (EXTREME)' }
  ];

  const handleDifficultySelect = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    setPhase('OPPONENT');
  };

  const handleOpponentSelect = (opp: OpponentType) => {
    onStart(selectedDifficulty, opp);
  };

  if (phase === 'START') {
    return (
      <div className="menu-overlay" onClick={() => setPhase('DIFFICULTY')}>
        <h1 className="start-title neon-text-cyan blinker">T R O N</h1>
        <h2 className="insert-coin neon-text-orange">INSERT COIN</h2>
        <div className="controls fade-pulse">CLICK TO START</div>
      </div>
    );
  }

  if (phase === 'DIFFICULTY') {
    return (
      <div className="menu-overlay">
        <h2 className="menu-title neon-text-cyan">SELECT DIFFICULTY</h2>
        <div className="menu-options">
          {difficulties.map(diff => {
            let styling = 'neon-text-cyan menu-item';
            if (diff === 'HARD') styling = 'chromatic-neon menu-item';
            if (diff === 'GRID') styling = 'glitch-text danger-text menu-item';
            return (
              <div key={diff} className={styling} onClick={() => handleDifficultySelect(diff)}>
                {`> ${diff} <`}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'OPPONENT') {
    return (
      <div className="menu-overlay">
        <h2 className="menu-title neon-text-cyan">SELECT OPPONENT</h2>
        <div className="menu-options">
          {opponents.map(opp => {
            let styling = 'neon-text-orange menu-item';
            if (opp.type === 'CLU') styling = 'neon-text-yellow menu-item';
            if (opp.type === 'RINZLER') styling = 'danger-text glitch-text-small menu-item';

            return (
              <div key={opp.type} className={styling} onClick={() => handleOpponentSelect(opp.type)}>
                {`> ${opp.label} <`}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
