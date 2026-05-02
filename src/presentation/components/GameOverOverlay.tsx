import { type GameState } from '../../core/domain/entities/GameState';

interface GameOverOverlayProps {
  state: GameState;
  onRetry: () => void;
  onMainMenu: () => void;
}
//222
export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ state, onRetry, onMainMenu }) => {
  const winnerText = state.winnerId === 'tie' ? 'DRAW' : `${state.winnerId === 'p1' ? 'PLAYER 1' : 'OPPONENT'} WINS`;
  const p1Derezzed = state.winnerId !== 'tie' && state.winnerId !== 'p1';

  return (
    <div className="menu-overlay game-over-overlay">
      <h1 className="start-title danger-text">{p1Derezzed ? 'IDENTITY DISC DEREZZED' : 'SYSTEM OVERRIDE'}</h1>
      <h2 className="neon-text-cyan mb-lg">{winnerText}</h2>

      <div className="score-board">
        <div>P1 SCORE: {state.score.p1}</div>
        <div>P2 SCORE: {state.score.p2}</div>
      </div>

      <div className="menu-options mt-xl">
        <div className="neon-text-cyan menu-item" onClick={onRetry}>
          &gt; RETRY MATCH
        </div>
        <div className="neon-text-orange menu-item" onClick={onMainMenu}>
          &gt; RETURN TO MAIN MENU
        </div>
      </div>
    </div>
  );
};
