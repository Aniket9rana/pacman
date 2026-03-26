export default class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.chompSource = null;
    this.chompGain = null;
    this.isChomping = false;
  }

  // AudioContext must be created after a user interaction
  resumeAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  _createOscillator(type, frequency, volume) {
    if (!this.audioCtx) return null;
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.type = type;
    osc.frequency.value = frequency;
    gainNode.gain.value = volume;

    return { osc, gainNode };
  }

  playIntro() {
    this.resumeAudioContext();
    if (!this.audioCtx) return;

    const notes = [28, 31, 35, 23, 28, 31, 35, 23];
    const noteDuration = 0.1;
    const startTime = this.audioCtx.currentTime;

    notes.forEach((note, i) => {
      const { osc, gainNode } = this._createOscillator(
        "square",
        110 * Math.pow(2, note / 12),
        0.15,
      );
      if (osc) {
        osc.start(startTime + i * noteDuration);
        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + (i + 1) * noteDuration,
        );
        osc.stop(startTime + (i + 1) * noteDuration);
      }
    });
  }

  playChomp() {
    if (!this.audioCtx) return;
    if (this.isChomping) {
      // Modulate the existing chomp sound for the "waka waka" effect
      this.chompGain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      this.chompGain.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioCtx.currentTime + 0.1,
      );
    } else {
      this.isChomping = true;
      const { osc, gainNode } = this._createOscillator("square", 60, 0.1);
      if (osc) {
        this.chompSource = osc;
        this.chompGain = gainNode;
        this.chompSource.start();

        // Stop it after a short time if no new chomp comes in
        setTimeout(() => {
          this.stopChomp();
        }, 150);
      }
    }
  }

  stopChomp() {
    if (this.isChomping && this.chompSource) {
      this.chompSource.stop();
      this.isChomping = false;
    }
  }

  playPowerPellet() {
    // A low hum for the power pellet duration
    // This is a simplified version. A real one would have a more complex waveform.
    if (!this.audioCtx) return;
    const { osc, gainNode } = this._createOscillator("sawtooth", 50, 0.2);
    if (osc) {
      osc.start();
      setTimeout(() => {
        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          this.audioCtx.currentTime + 1,
        );
        osc.stop(this.audioCtx.currentTime + 1);
      }, 6500); // Should match frightened time
    }
  }

  playGhostEat() {
    if (!this.audioCtx) return;
    const { osc, gainNode } = this._createOscillator("sawtooth", 300, 0.2);
    if (osc) {
      osc.frequency.exponentialRampToValueAtTime(
        1200,
        this.audioCtx.currentTime + 0.5,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioCtx.currentTime + 0.5,
      );
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    }
  }

  playDeath() {
    if (!this.audioCtx) return;
    const { osc, gainNode } = this._createOscillator("triangle", 440, 0.3);
    if (osc) {
      osc.frequency.exponentialRampToValueAtTime(
        110,
        this.audioCtx.currentTime + 1.5,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioCtx.currentTime + 1.5,
      );
      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.5);
    }
  }

  playExtraLife() {
    if (!this.audioCtx) return;
    const { osc, gainNode } = this._createOscillator("sine", 880, 0.2);
    if (osc) {
      osc.frequency.exponentialRampToValueAtTime(
        1760,
        this.audioCtx.currentTime + 0.3,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioCtx.currentTime + 0.3,
      );
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    }
  }

  playLevelClear() {
    if (!this.audioCtx) return;
    const notes = [440, 554, 659, 880];
    const startTime = this.audioCtx.currentTime;
    notes.forEach((freq, i) => {
      const { osc, gainNode } = this._createOscillator("square", freq, 0.1);
      if (osc) {
        osc.start(startTime + i * 0.1);
        osc.stop(startTime + (i + 1) * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + (i + 1) * 0.1,
        );
      }
    });
  }
}
