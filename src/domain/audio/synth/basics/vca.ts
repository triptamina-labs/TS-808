// @ts-nocheck
import WebAudioModule from "synth/webAudioModule";

class VCA {
  constructor(audioCtx) {
    this.gain = audioCtx.createGain();

    // Set initial gain value.
    this.gain.gain.value = 0;

    // Set WebAudioModule requirements.
    this.input = this.gain;
    this.output = this.gain;

    // Make amplitude parameter available for connection.
    this.amplitude = this.gain.gain;
  }
}

export default WebAudioModule(VCA);
