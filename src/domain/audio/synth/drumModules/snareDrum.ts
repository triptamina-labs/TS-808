// @ts-nocheck
import ADGenerator, { LINEAR } from "synth/basics/ADGenerator";
import VCA from "synth/basics/vca";
import VCF, { HIGHPASS } from "synth/basics/vcf";
import VCO, { SINE, WHITE_NOISE } from "synth/basics/vco";
import { equalPower } from "helpers";

const highOscFreq = 476;
const lowOscFreq = 238;

export default function snareDrum(audioCtx, destination, time, { level, tone, snappy }) {
  // Parameters.
  const outputLevel = equalPower(level);
  const noiseVCFFreq = tone * 100 + 800;
  const snappyEnvAmt = snappy / 200;

  // Audio modules.
  const highOsc = new VCO(SINE, audioCtx);
  highOsc.frequency.value = highOscFreq;

  const lowOsc = new VCO(SINE, audioCtx);
  lowOsc.frequency.value = lowOscFreq;

  const noiseOsc = new VCO(WHITE_NOISE, audioCtx);

  const noiseVCF = new VCF(HIGHPASS, audioCtx);
  noiseVCF.frequency.value = noiseVCFFreq;

  const oscVCA = new VCA(audioCtx);
  const noiseVCA = new VCA(audioCtx);

  const outputVCA = new VCA(audioCtx);
  outputVCA.amplitude.value = outputLevel;

  // Envelopes.
  const noiseEnv = new ADGenerator(LINEAR, 0.1, 75, 0, 0.5);
  const snappyEnv = new ADGenerator(LINEAR, 0.1, 50, 0, snappyEnvAmt);

  // Module routing.
  highOsc.connect(oscVCA);
  lowOsc.connect(oscVCA);
  oscVCA.connect(outputVCA);

  noiseOsc.connect(noiseVCF);
  noiseVCF.connect(noiseVCA);
  noiseVCA.connect(outputVCA);

  // Modulation routing.
  noiseEnv.connect(noiseVCA.amplitude);
  snappyEnv.connect(oscVCA.amplitude);

  // Output routing.
  outputVCA.connect(destination);

  // Trigger.
  highOsc.start(time);
  lowOsc.start(time);
  noiseOsc.start(time);
  noiseEnv.trigger(time);
  snappyEnv.trigger(time);

  // Cleanup.
  window.setTimeout(() => {
    highOsc.stop();
    lowOsc.stop();
    outputVCA.disconnect();
  }, time - audioCtx.currentTime + 1000);

  return outputVCA;
}
