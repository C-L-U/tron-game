import { Vector2D } from '../value-objects/Vector2D';

export class LightCycle {
  public trail: Vector2D[] = [];
  public alive: boolean = true;
  
  public readonly id: string;
  public position: Vector2D;
  public direction: Vector2D;
  public readonly color: string;
  public readonly speed: number;

  constructor(
    id: string,
    position: Vector2D,
    direction: Vector2D,
    color: string,
    speed: number
  ) {
    this.id = id;
    this.position = position;
    this.direction = direction;
    this.color = color;
    this.speed = speed;
  }

  public move(): void {
    if (!this.alive) return;
    
    // Optional: add only turns to trail for memory optimization, but per-tile logic usually requires all,
    // or we represent trails as lines instead of individual points.
    // Let's store individual tile vectors for simplicity of intersection in a grid-based arcade game.
    this.trail.push(new Vector2D(this.position.x, this.position.y));
    this.position = this.position.add(this.direction.scale(this.speed));
  }

  public changeDirection(newDir: Vector2D): void {
    // Prevent 180 degree turns
    if (this.direction.x !== 0 && newDir.x !== 0) return;
    if (this.direction.y !== 0 && newDir.y !== 0) return;
    this.direction = newDir;
  }

  public die(): void {
    this.alive = false;
  }
}
