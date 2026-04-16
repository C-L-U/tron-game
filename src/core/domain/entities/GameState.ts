export interface Player {
  id: string;
  score: number;
  lightCycleId: string;
}

export type GameStatus = 'MENU' | 'SELECT_DIFFICULTY' | 'SELECT_OPPONENT' | 'PLAYING' | 'GAME_OVER' | 'ATTRACT_MODE';

export type Difficulty = 'DEFAULT' | 'HARD' | 'GRID';
export type OpponentType = 'RANDOM_PROGRAM' | 'CLU' | 'RINZLER';

export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  opponent: OpponentType;
  winnerId: string | null;
  score: Record<string, number>;
}
