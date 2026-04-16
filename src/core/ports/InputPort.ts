import { Vector2D } from '../domain/value-objects/Vector2D';

export interface InputRecord {
  p1Direction: Vector2D | null;
  p2Direction: Vector2D | null;
  startPressed: boolean;
  resetPressed: boolean;
}

export interface InputPort {
  poll(): InputRecord;
  init(): void;
  dispose(): void;
}
