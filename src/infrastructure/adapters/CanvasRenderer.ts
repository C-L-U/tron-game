import { type RenderPort } from '../../core/ports/RenderPort';
import { Grid } from '../../core/domain/entities/Grid';
import { LightCycle } from '../../core/domain/entities/LightCycle';
import { type GameState } from '../../core/domain/entities/GameState';

export class CanvasRenderer implements RenderPort {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private scaleX: number;
  private scaleY: number;

  private canvas: HTMLCanvasElement;
  private logicalGridWidth: number;
  private logicalGridHeight: number;

  constructor(
    canvas: HTMLCanvasElement,
    logicalGridWidth: number,
    logicalGridHeight: number
  ) {
    this.canvas = canvas;
    this.logicalGridWidth = logicalGridWidth;
    this.logicalGridHeight = logicalGridHeight;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not initialize canvas context');
    this.ctx = context;

    // Use actual CSS dimensions to set canvas internal resolution
    const rect = canvas.getBoundingClientRect();
    this.width = rect.width || canvas.width;
    this.height = rect.height || canvas.height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.scaleX = this.width / this.logicalGridWidth;
    this.scaleY = this.height / this.logicalGridHeight;
  }

  public clear(): void {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = '#050510'; // Deep arcade black/blue
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public drawGrid(grid: Grid): void {
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    const step = 10;
    for (let x = 0; x <= grid.width; x += step) {
      this.ctx.moveTo(x * this.scaleX, 0);
      this.ctx.lineTo(x * this.scaleX, this.height);
    }
    for (let y = 0; y <= grid.height; y += step) {
      this.ctx.moveTo(0, y * this.scaleY);
      this.ctx.lineTo(this.width, y * this.scaleY);
    }
    this.ctx.stroke();

    // Board Border
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }

  public drawTrail(cycle: LightCycle): void {
    if (cycle.trail.length === 0) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = cycle.color;
    this.ctx.lineWidth = Math.max(2, this.scaleX);
    this.ctx.lineCap = 'square';
    this.ctx.lineJoin = 'miter';

    this.ctx.moveTo(cycle.trail[0].x * this.scaleX, cycle.trail[0].y * this.scaleY);
    for (let i = 1; i < cycle.trail.length; i++) {
      this.ctx.lineTo(cycle.trail[i].x * this.scaleX, cycle.trail[i].y * this.scaleY);
    }
    // Connect to current pos
    this.ctx.lineTo(cycle.position.x * this.scaleX, cycle.position.y * this.scaleY);

    this.ctx.stroke();
  }

  public drawCycle(cycle: LightCycle): void {
    this.ctx.fillStyle = '#ffffff'; // The "head"
    const size = Math.max(3, this.scaleX * 2);
    this.ctx.fillRect(
      cycle.position.x * this.scaleX - size / 2,
      cycle.position.y * this.scaleY - size / 2,
      size,
      size
    );
  }

  public applyGlow(difficulty?: string): void {
      // Vector glow is handled by CSS filters on the canvas element.
      // However, if the difficulty is GRID, we might change context styling here or in CSS.
      // Easiest is to add a class to the canvas element in React, which we'll do in CanvasGameArea.
  }
}
