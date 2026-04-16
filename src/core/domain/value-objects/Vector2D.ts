export class Vector2D {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  public scale(factor: number): Vector2D {
    return new Vector2D(this.x * factor, this.y * factor);
  }

  public equals(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

export const Direction = {
  UP: new Vector2D(0, -1),
  DOWN: new Vector2D(0, 1),
  LEFT: new Vector2D(-1, 0),
  RIGHT: new Vector2D(1, 0),
} as const;

export type DirectionKey = keyof typeof Direction;
