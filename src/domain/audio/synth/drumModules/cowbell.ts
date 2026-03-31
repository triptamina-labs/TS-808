// @ts-nocheck
import ADGenerator, { EXPONENTIAL, LINEAR } from "synth/basics/ADGenerator";
import VCA from "synth/basics/vca";
import VCF, { BANDPASS } from "synth/basics/vcf";
import VCO, { SQUARE } from "synth/basics/vco";
import { equalPower } from "helpers";

const BANDPASS_FREQ = 2640;
const BANDPASS_Q = 1;

const HIGH_OSC_FREQ = 800;
const LOW_OSC_FREQ = 540;

const SHORT_DECAY = 15;
const LONG_DECAY = 400;
const LONG_AMT = 0.25;

export default function cowbell(audioCtx, destination, time, { level }) {
  // Parameters.
  const outputLevel = equalPower(level);

  // Audio modules.
  const highOsc = new VCO(SQUARE, audioCtx);
  highOsc.frequency.value = HIGH_OSC_FREQ;

  const lowOsc = new VCO(SQUARE, audioCtx);
  lowOsc.frequency.value = LOW_OSC_FREQ;

  const bandFilter = new VCF(BANDPASS, audioCtx);
  bandFilter.frequency.value = BANDPASS_FREQ;
  bandFilter.Q.value = BANDPASS_Q;

  const shortVCA = new VCA(audioCtx);
  const longVCA = new VCA(audioCtx);

  const outputVCA = new VCA(audioCtx);
  outputVCA.amplitude.value = outputLevel;

  // Modulators.
  const shortEnv = new ADGenerator(LINEAR, 0.11, SHORT_DECAY, 0, (1.0 - LONG_AMT) / 2);
  const longEnv = new ADGenerator(EXPONENTIAL, SHORT_DECAY, LONG_DECAY, 0, LONG_AMT / 2);

  // Audio routing.
  highOsc.connect(shortVCA);
  highOsc.connect(longVCA);
  lowOsc.connect(shortVCA);
  lowOsc.connect(longVCA);

  shortVCA.connect(bandFilter);
  longVCA.connect(bandFilter);

  bandFilter.connect(outputVCA);

  // Modulator routing.
  shortEnv.connect(shortVCA.amplitude);
  longEnv.connect(longVCA.amplitude);

  // Output routing.
  outputVCA.connect(destination);

  // Triggering.
  lowOsc.start(time);
  highOsc.start(time);
  shortEnv.trigger(time);
  longEnv.trigger(time);

  // Cleanup.
  window.setTimeout(() => {
    lowOsc.stop();
    highOsc.stop();
    outputVCA.disconnect();
  }, time - audioCtx.currentTime + 1000);

  return outputVCA;
}
