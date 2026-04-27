import { type AudioPort } from '../../core/ports/AudioPort';

export class WebAudioAdapter implements AudioPort {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  //here u can create something interesting
  public init(): void {
  }

  private ensureInit() {
    if (!this.isInitialized) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.isInitialized = true;
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    }
  }
  //ffffffff
  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playMove(): void {
    this.ensureInit();
    this.playTone(400, 'square', 0.1, 0.05);
  }

  public playCrash(): void {
    this.ensureInit();
    if (!this.ctx) return;

    // Crash sound: noise burst
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playStart(): void {
    this.ensureInit();
    // Insert Coin chirp
    this.playTone(880, 'square', 0.1, 0.1);
    setTimeout(() => this.playTone(1760, 'square', 0.2, 0.1), 100);
  }
}
