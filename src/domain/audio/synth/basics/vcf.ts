// @ts-nocheck
import WebAudioModule from "synth/webAudioModule";

// Filter types.
export const LOWPASS = "lowpass";
export const HIGHPASS = "highpass";
export const BANDPASS = "bandpass";

class VCF {
  constructor(type, audioCtx) {
    this.filter = audioCtx.createBiquadFilter();

    // Set default values.
    this.filter.frequency.value = 400;
    this.filter.Q.value = 1;

    // Set filter type given to constructor.
    this.filter.type = type;

    // WebAudioModule requirements.
    this.input = this.filter;
    this.output = this.filter;

    // Expose params.
    this.frequency = this.filter.frequency;
    this.Q = this.filter.Q;
  }
}

export default WebAudioModule(VCF);
