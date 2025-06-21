
class SoundManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    this.initAudio();
  }

  private async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Set volume to 30%
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  private async playTone(frequency: number, duration: number = 0.3) {
    if (!this.audioContext || !this.gainNode) return;

    try {
      await this.audioContext.resume();
      
      const oscillator = this.audioContext.createOscillator();
      const envelope = this.audioContext.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(this.gainNode);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
      envelope.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
      envelope.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }

  playDiscoveryChime(step: number) {
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00]; // C-D-E-F-G
    this.playTone(frequencies[step] || 440);
  }

  playSuccessSound() {
    // Play a pleasant chord
    setTimeout(() => this.playTone(523.25), 0);   // C5
    setTimeout(() => this.playTone(659.25), 100); // E5
    setTimeout(() => this.playTone(783.99), 200); // G5
  }

  playCompletionFanfare() {
    const melody = [523.25, 659.25, 783.99, 1046.5]; // C-E-G-C octave
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.5), i * 200);
    });
  }
}

export const soundManager = new SoundManager();
