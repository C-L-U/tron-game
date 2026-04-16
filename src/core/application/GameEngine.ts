import { type GameState } from '../domain/entities/GameState';
import { LightCycle } from '../domain/entities/LightCycle';
import { Grid } from '../domain/entities/Grid';
import { Vector2D, Direction } from '../domain/value-objects/Vector2D';
import { type InputPort } from '../ports/InputPort';
import { type RenderPort } from '../ports/RenderPort';
import { type AudioPort } from '../ports/AudioPort';
import type { Difficulty, OpponentType } from '../domain/entities/GameState';

export class GameEngine {
  public state: GameState;
  public grid: Grid;
  public cycles: LightCycle[] = [];

  private occupiedCells: Set<string> = new Set();

  private lastRenderTime: number = 0;
  private accumulator: number = 0;
  private readonly TICK_RATE = 1000 / 60; // 60 FPS Logic
  private animationFrameId: number | null = null;
  private attractModeTimer: number = 0;

  private renderPort: RenderPort;
  private inputPort: InputPort;
  private audioPort: AudioPort;

  constructor(
    renderPort: RenderPort,
    inputPort: InputPort,
    audioPort: AudioPort,
    gridWidth: number = 200,
    gridHeight: number = 200
  ) {
    this.renderPort = renderPort;
    this.inputPort = inputPort;
    this.audioPort = audioPort;
    this.grid = new Grid(gridWidth, gridHeight);
    this.state = {
      status: 'MENU',
      difficulty: 'DEFAULT',
      opponent: 'RANDOM_PROGRAM',
      winnerId: null,
      score: { p1: 0, p2: 0 }
    };
  }

  public init() {
    this.inputPort.init();
    this.audioPort.init();
    this.startLoop();
  }

  public dispose() {
    this.inputPort.dispose();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  public setDifficulty(diff: Difficulty) {
    this.state.difficulty = diff;
  }

  public setOpponent(opp: OpponentType) {
    this.state.opponent = opp;
  }

  public startGame() {
    this.audioPort.playStart();
    this.resetGame('PLAYING');
  }

  public resetToMenu() {
    this.state.status = 'MENU';
  }

  private resetGame(status: 'PLAYING' | 'ATTRACT_MODE') {
    this.state.status = status;
    this.state.winnerId = null;
    this.occupiedCells.clear();

    const speedMultiplier = this.state.difficulty === 'GRID' ? 2 : (this.state.difficulty === 'HARD' ? 1.5 : 1);

    // Player 1
    const p1 = new LightCycle('p1', new Vector2D(this.grid.width * 0.2, this.grid.height * 0.5), Direction.RIGHT, '#00ffff', 1 * speedMultiplier);

    // Player 2 (or AI)
    let p2Color = '#ff8c00'; // Normal orange
    let p2Speed = 1 * speedMultiplier;

    if (this.state.opponent === 'CLU') {
      p2Color = '#ffff00'; // Yellow
    } else if (this.state.opponent === 'RINZLER') {
      p2Color = '#ff4500'; // Deep/Strong Orange Red
      p2Speed = 1.2 * speedMultiplier; // slightly faster than player
    }

    const p2 = new LightCycle('p2', new Vector2D(this.grid.width * 0.8, this.grid.height * 0.5), Direction.LEFT, p2Color, p2Speed);

    this.cycles = [p1, p2];

    // Mark starting points
    this.cycles.forEach(c => this.markOccupied(c.position));
  }

  private startLoop() {
    const loop = (time: number) => {
      if (!this.lastRenderTime) this.lastRenderTime = time;
      const deltaTime = time - this.lastRenderTime;
      this.lastRenderTime = time;

      this.accumulator += deltaTime;

      while (this.accumulator >= this.TICK_RATE) {
        this.tick();
        this.accumulator -= this.TICK_RATE;
      }

      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private markOccupied(pos: Vector2D) {
    this.occupiedCells.add(`${Math.round(pos.x)},${Math.round(pos.y)}`);
  }

  private isOccupied(pos: Vector2D): boolean {
    return this.occupiedCells.has(`${Math.round(pos.x)},${Math.round(pos.y)}`);
  }

  private tick() {
    const input = this.inputPort.poll();

    if (this.state.status !== 'PLAYING' && this.state.status !== 'ATTRACT_MODE' && this.state.status !== 'GAME_OVER') {
      // Allow attract mode to start if left on main menu
      if (this.state.status === 'MENU') {
        this.attractModeTimer++;
        if (this.attractModeTimer > 60 * 5) { // 5 seconds idle
          this.resetGame('ATTRACT_MODE');
          this.attractModeTimer = 0;
        }
      }
      return;
    }

    // Wake from attract mode on any key
    if (this.state.status === 'ATTRACT_MODE' && (input.startPressed || input.resetPressed || input.p1Direction)) {
      this.state.status = 'MENU';
      return;
    }

    // Handle Input
    if (this.cycles[0].alive && input.p1Direction && this.state.status !== 'ATTRACT_MODE') {
      this.cycles[0].changeDirection(input.p1Direction);
      this.audioPort.playMove(); // Maybe debounce this to avoid ear rape
    }

    // Extremely basic AI for Attract mode or P2
    this.cycles.forEach((cycle, index) => {
      if (this.state.status === 'ATTRACT_MODE' || index === 1) {
        this.performAIAvoidance(cycle);
      }
    });

    let anyCrash = false;

    // Movement and collision
    this.cycles.forEach(cycle => {
      if (!cycle.alive) return;

      const nextPos = cycle.position.add(cycle.direction.scale(cycle.speed));

      // Wall collision
      if (this.grid.isOutOfBounds(nextPos.x, nextPos.y) || this.isOccupied(nextPos)) {
        cycle.die();
        this.audioPort.playCrash();
        anyCrash = true;
      } else {
        cycle.move();
        this.markOccupied(cycle.position); // register trail
      }
    });

    if (anyCrash) {
      this.handleGameOver();
    }
  }

  private performAIAvoidance(cycle: LightCycle) {
    if (!cycle.alive) return;

    // Advanced look ahead logic. 
    // Rinzler reads much further ahead, Random reads basic
    const lookAheadMultiplier = this.state.opponent === 'RINZLER' ? 5 : (this.state.opponent === 'CLU' ? 3 : 2);

    const nextPos = cycle.position.add(cycle.direction.scale(cycle.speed * lookAheadMultiplier));
    const lookAhead = this.isOccupied(nextPos) || this.grid.isOutOfBounds(nextPos.x, nextPos.y);

    if (lookAhead) {
      const currentDirIndex = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT].indexOf(cycle.direction);
      if (currentDirIndex === -1) return;

      const turnRight = [Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP][currentDirIndex];
      const turnLeft = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN][currentDirIndex];

      const rightPos = cycle.position.add(turnRight.scale(cycle.speed * 2));
      const leftPos = cycle.position.add(turnLeft.scale(cycle.speed * 2));

      const rightOk = !this.isOccupied(rightPos) && !this.grid.isOutOfBounds(rightPos.x, rightPos.y);
      const leftOk = !this.isOccupied(leftPos) && !this.grid.isOutOfBounds(leftPos.x, leftPos.y);

      // Pathfinding heuristic
      let favorRight = Math.random() > 0.5;

      if (this.state.opponent === 'CLU' || this.state.opponent === 'RINZLER') {
        // Aggressive steering towards player 1
        const p1 = this.cycles[0];
        if (p1 && p1.alive) {
          // Very simple heuristic to close the gap on their axis
          const testDiffRight = cycle.position.add(turnRight.scale(cycle.speed)).x - p1.position.x;
          const testDiffLeft = cycle.position.add(turnLeft.scale(cycle.speed)).x - p1.position.x;

          if (Math.abs(testDiffRight) < Math.abs(testDiffLeft)) favorRight = true;
          else favorRight = false;
        }
      }

      if (rightOk && (!leftOk || favorRight)) {
        cycle.changeDirection(turnRight);
        this.audioPort.playMove();
      } else if (leftOk) {
        cycle.changeDirection(turnLeft);
        this.audioPort.playMove();
      }
    }
    else {
      // Occasional random or aggressive turn
      const randomThreshold = this.state.opponent === 'RINZLER' ? 0.05 : 0.01;
      if (Math.random() < randomThreshold) {
        const currentDirIndex = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT].indexOf(cycle.direction);
        const turnRight = [Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP][currentDirIndex];
        const turnLeft = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN][currentDirIndex];

        let chosenTurn = Math.random() > 0.5 ? turnRight : turnLeft;

        if (this.state.opponent === 'CLU' || this.state.opponent === 'RINZLER') {
          const p1 = this.cycles[0];
          if (p1 && p1.alive) {
            const dy = p1.position.y - cycle.position.y;
            const dx = p1.position.x - cycle.position.x;
            // Attempt to intersect their box
            if (Math.abs(dx) > Math.abs(dy)) {
              if (turnRight.x === Math.sign(dx)) chosenTurn = turnRight;
              else chosenTurn = turnLeft;
            } else {
              if (turnRight.y === Math.sign(dy)) chosenTurn = turnRight;
              else chosenTurn = turnLeft;
            }
          }
        }

        const testPos = cycle.position.add(chosenTurn.scale(cycle.speed * 2));
        if (!this.isOccupied(testPos) && !this.grid.isOutOfBounds(testPos.x, testPos.y)) {
          cycle.changeDirection(chosenTurn);
          this.audioPort.playMove();
        }
      }
    }
  }

  private handleGameOver() {
    this.state.status = 'GAME_OVER';
    const aliveCycles = this.cycles.filter(c => c.alive);
    if (aliveCycles.length === 1) {
      const winner = aliveCycles[0];
      this.state.winnerId = winner.id;
      if (this.state.score[winner.id] !== undefined) {
        this.state.score[winner.id]++;
      }
    } else {
      this.state.winnerId = 'tie';
    }
  }

  private render() {
    this.renderPort.clear();

    if (this.state.status === 'PLAYING' || this.state.status === 'ATTRACT_MODE' || this.state.status === 'GAME_OVER') {
      this.renderPort.drawGrid(this.grid);
      this.cycles.forEach(cycle => {
        this.renderPort.drawTrail(cycle);
        if (cycle.alive) {
          this.renderPort.drawCycle(cycle);
        }
      });
      this.renderPort.applyGlow();
    }
  }
}
