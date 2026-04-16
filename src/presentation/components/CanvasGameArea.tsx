import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../../core/application/GameEngine';
import { CanvasRenderer } from '../../infrastructure/adapters/CanvasRenderer';
import { KeyboardAdapter } from '../../infrastructure/adapters/KeyboardAdapter';
import { WebAudioAdapter } from '../../infrastructure/adapters/WebAudioAdapter';
import { MenuOverlay } from './MenuOverlay';
import { GameOverOverlay } from './GameOverOverlay';
import type { Difficulty, OpponentType, GameState } from '../../core/domain/entities/GameState';

export const CanvasGameArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (!canvasRef.current || engineRef.current) return;

    const renderer = new CanvasRenderer(canvasRef.current, 200, 200);
    const keyboard = new KeyboardAdapter();
    const audio = new WebAudioAdapter();

    const engine = new GameEngine(renderer, keyboard, audio, 200, 200);
    engine.init();

    engineRef.current = engine;
    setGameState(engine.state);

    const interval = setInterval(() => {
      // Force trigger re-render on state changes
      setGameState({ ...engine.state });
    }, 100); // 10fps UI polling is fine for Menus

    return () => {
      clearInterval(interval);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const handleStart = (difficulty: Difficulty, opponent: OpponentType) => {
    if (engineRef.current) {
      engineRef.current.setDifficulty(difficulty);
      engineRef.current.setOpponent(opponent);
      engineRef.current.startGame();
      // force update
      setGameState({ ...engineRef.current.state });
    }
  };

  const handleRetry = () => {
    if (engineRef.current) {
      engineRef.current.startGame();
      setGameState({ ...engineRef.current.state });
    }
  }

  const handleMainMenu = () => {
    if (engineRef.current) {
      engineRef.current.resetToMenu();
      setGameState({ ...engineRef.current.state });
    }
  }

  const isMenu = gameState?.status === 'MENU';
  const isGameOver = gameState?.status === 'GAME_OVER';

  return (
    <>
      {isMenu && <MenuOverlay onStart={handleStart} />}
      {isGameOver && <GameOverOverlay state={gameState!} onRetry={handleRetry} onMainMenu={handleMainMenu} />}
      <canvas ref={canvasRef} className={gameState?.difficulty === 'GRID' ? 'danger-grid-canvas' : ''} />
    </>
  );
};
