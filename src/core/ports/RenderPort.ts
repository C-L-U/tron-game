import { LightCycle } from '../domain/entities/LightCycle';
import { Grid } from '../domain/entities/Grid';

export interface RenderPort {
  clear(): void;
  drawGrid(grid: Grid): void;
  drawCycle(cycle: LightCycle): void;
  drawTrail(cycle: LightCycle): void;
  applyGlow(difficulty?: string): void;
}
