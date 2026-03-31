// @ts-nocheck
import ADGenerator, { LINEAR } from "synth/basics/ADGenerator";
import SquareOscBank from "synth/basics/squareOscBank";
import VCA from "synth/basics/vca";
import VCF, { BANDPASS, HIGHPASS } from "synth/basics/vcf";

const MID_FILTER_FREQ = 10000;
const HIGH_FILTER_FREQ = 8000;

export default function hiHat(audioCtx, destination, time, outputLevel, decay) {
  // Audio modules.
  const oscBank = new SquareOscBank(audioCtx);

  const midFilter = new VCF(BANDPASS, audioCtx);
  midFilter.frequency.value = MID_FILTER_FREQ;

  const highFilter = new VCF(HIGHPASS, audioCtx);
  highFilter.frequency.value = HIGH_FILTER_FREQ;

  const outputVCA = new VCA(audioCtx);
  outputVCA.amplitude.value = outputLevel;

  const modVCA = new VCA(audioCtx);

  // Modulators.
  const env = new ADGenerator(LINEAR, 0.1, decay, 0, 1);

  // Audio routing.
  oscBank.connect(midFilter);
  midFilter.connect(modVCA);
  modVCA.connect(highFilter);
  highFilter.connect(outputVCA);

  // Modulation routing.
  env.connect(modVCA.amplitude);

  // Output routing.
  outputVCA.connect(destination);

  // Triggering.
  oscBank.start(time);
  env.trigger(time);

  // Cleanup.
  window.setTimeout(() => {
    oscBank.stop();
    outputVCA.disconnect();
  }, time - audioCtx.currentTime + 1000);

  return outputVCA;
}
