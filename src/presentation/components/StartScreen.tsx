interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="start-screen" onClick={onStart}>
      <h1 className="start-title neon-text-cyan">T R O N</h1>
      <h2 className="insert-coin neon-text-orange">INSERT COIN (PRESS ENTER)</h2>

      <div className="controls">
        <div>P1: WASD</div>
        <div>P2: ARROWS</div>
      </div>
    </div>
  );
};
