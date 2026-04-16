export class Grid {
  public readonly width: number;
  public readonly height: number;

  constructor(
    width: number,
    height: number
  ) {
    this.width = width;
    this.height = height;
  }

  public isOutOfBounds(x: number, y: number): boolean {
    return x < 0 || x >= this.width || y < 0 || y >= this.height;
  }
}
