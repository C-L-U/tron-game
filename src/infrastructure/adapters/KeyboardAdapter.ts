import type { InputPort, InputRecord } from '../../core/ports/InputPort';
import { Direction } from '../../core/domain/value-objects/Vector2D';

export class KeyboardAdapter implements InputPort {
  private record: InputRecord = {
    p1Direction: null,
    p2Direction: null,
    startPressed: false,
    resetPressed: false
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      // P1 Keys (Arrow keys)
      case 'ArrowUp':
        this.record.p1Direction = Direction.UP;
        break;
      case 'ArrowDown':
        this.record.p1Direction = Direction.DOWN;
        break;
      case 'ArrowLeft':
        this.record.p1Direction = Direction.LEFT;
        break;
      case 'ArrowRight':
        this.record.p1Direction = Direction.RIGHT;
        break;

      // P2 Keys (WASD) - Or secondary attract mode override
      case 'KeyW':
        this.record.p2Direction = Direction.UP;
        break;
      case 'KeyS':
        this.record.p2Direction = Direction.DOWN;
        break;
      case 'KeyA':
        this.record.p2Direction = Direction.LEFT;
        break;
      case 'KeyD':
        this.record.p2Direction = Direction.RIGHT;
        break;

      case 'Enter':
        this.record.startPressed = true;
        this.record.resetPressed = true;
        break;
    }
  };

  public init(): void {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  public poll(): InputRecord {
    // Return copy of current state, clear edge triggers
    const current = { ...this.record };

    // Clear instant pushes
    this.record.startPressed = false;
    this.record.resetPressed = false;
    this.record.p1Direction = null; // Consume directions to avoid multi-apply
    this.record.p2Direction = null;

    return current;
  }
}
