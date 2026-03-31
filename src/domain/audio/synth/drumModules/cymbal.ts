// @ts-nocheck
import ADGenerator, { EXPONENTIAL } from "synth/basics/ADGenerator";
import SquareOscBank from "synth/basics/squareOscBank";
import VCA from "synth/basics/vca";
import VCF, { BANDPASS, HIGHPASS } from "synth/basics/vcf";
import { equalPower } from "helpers";

const LOW_FILTER_FREQ = 5000;
const MID_HIGH_FILTER_FREQ = 10000;
const HIGH_FILTER_FREQ = 8000;
const HIGH_DECAY = 150;
const MID_DECAY = 400;

export default function cymbal(audioCtx, destination, time, { level, tone, decay }) {
  // Parameters.
  const outputLevel = equalPower(level);
  const lowDecay = decay * 8.5 + 700;

  // Tone ratio.
  const lowEnvAmt = 0.666 - (tone / 100) * 0.666;
  const midEnvAmt = 0.333;
  const highEnvAmt = 0.666 - (1 - tone / 100) * 0.666;

  // Audio modules.
  const oscBank = new SquareOscBank(audioCtx);

  const lowBandFilter = new VCF(BANDPASS, audioCtx);
  lowBandFilter.frequency.value = LOW_FILTER_FREQ;
  const lowVCA = new VCA(audioCtx);

  const lowHighpassFilter = new VCF(HIGHPASS, audioCtx);
  lowHighpassFilter.frequency.value = LOW_FILTER_FREQ;

  const midHighBandFilter = new VCF(BANDPASS, audioCtx);
  midHighBandFilter.frequency.value = MID_HIGH_FILTER_FREQ;
  const midVCA = new VCA(audioCtx);

  const midHighpassFilter = new VCF(HIGHPASS, audioCtx);
  midHighpassFilter.frequency.value = MID_HIGH_FILTER_FREQ;

  const highFilter = new VCF(HIGHPASS, audioCtx);
  highFilter.frequency.value = HIGH_FILTER_FREQ;
  const highVCA = new VCA(audioCtx);

  const outputVCA = new VCA(audioCtx);
  outputVCA.amplitude.value = outputLevel;

  // Modulators.
  // For tone control, adjust env amounts per band instead of adding a mixer node.
  const lowEnv = new ADGenerator(EXPONENTIAL, 0.1, lowDecay, 0, lowEnvAmt);
  const midEnv = new ADGenerator(EXPONENTIAL, 0.1, MID_DECAY, 0, midEnvAmt);
  const highEnv = new ADGenerator(EXPONENTIAL, 0.1, HIGH_DECAY, 0, highEnvAmt);

  // Band splitting.
  oscBank.connect(lowBandFilter);
  oscBank.connect(midHighBandFilter);

  // Low band routing.
  lowBandFilter.connect(lowVCA);
  lowVCA.connect(lowHighpassFilter);
  lowHighpassFilter.connect(outputVCA);

  // Mid band routing.
  midHighBandFilter.connect(midVCA);
  midVCA.connect(midHighpassFilter);
  midHighpassFilter.connect(outputVCA);

  // High band routing.
  midHighBandFilter.connect(highVCA);
  highVCA.connect(highFilter);
  highFilter.connect(outputVCA);

  // Modulation routing.
  lowEnv.connect(lowVCA.amplitude);
  midEnv.connect(midVCA.amplitude);
  highEnv.connect(highVCA.amplitude);

  // Output routing.
  outputVCA.connect(destination);

  // Triggering.
  oscBank.start(time);
  lowEnv.trigger(time);
  midEnv.trigger(time);
  highEnv.trigger(time);

  // Cleanup.
  window.setTimeout(() => {
    oscBank.stop();
    outputVCA.disconnect();
  }, time - audioCtx.currentTime + 2000);

  return outputVCA;
}
