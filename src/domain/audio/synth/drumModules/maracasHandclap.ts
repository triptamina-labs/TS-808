// @ts-nocheck
import ADGenerator, { LINEAR } from "synth/basics/ADGenerator";
import SawEnvGenerator from "synth/basics/sawEnvGenerator";
import VCA from "synth/basics/vca";
import VCF, { BANDPASS, HIGHPASS } from "synth/basics/vcf";
import VCO, { WHITE_NOISE } from "synth/basics/vco";
import { equalPower } from "helpers";

// selector: 0 = maracas, 1 = handclap
export default function maracasHandclap(audioCtx, destination, time, { level, selector }) {
  // Parameters.
  const outputLevel = equalPower(level);

  // Shared audio modules.
  const osc = new VCO(WHITE_NOISE, audioCtx);
  osc.start(time);

  const outputVCA = new VCA(audioCtx);
  outputVCA.amplitude.value = outputLevel;

  // Maracas configuration.
  if (selector === 0) {
    const maracasFilter = new VCF(HIGHPASS, audioCtx);
    maracasFilter.frequency.value = 5000;

    const maracasVCA = new VCA(audioCtx);
    const maracasEnv = new ADGenerator(LINEAR, 0.2, 30, 0, 0.5);

    osc.connect(maracasFilter);
    maracasFilter.connect(maracasVCA);
    maracasVCA.connect(outputVCA);

    maracasEnv.connect(maracasVCA.amplitude);
    maracasEnv.trigger(time);
  } else if (selector === 1) {
    // Handclap configuration.
    const clapFilter = new VCF(BANDPASS, audioCtx);
    clapFilter.frequency.value = 1000;

    const sawVCA = new VCA(audioCtx);
    const reverVCA = new VCA(audioCtx);

    const sawEnv = new SawEnvGenerator();
    const reverEnv = new ADGenerator(LINEAR, 0.2, 115, 0, 0.75);

    osc.connect(clapFilter);
    clapFilter.connect(sawVCA);
    clapFilter.connect(reverVCA);
    sawVCA.connect(outputVCA);
    reverVCA.connect(outputVCA);

    sawEnv.connect(sawVCA.amplitude);
    reverEnv.connect(reverVCA.amplitude);

    sawEnv.trigger(time);
    reverEnv.trigger(time);
  }

  // Output routing.
  outputVCA.connect(destination);

  // Cleanup.
  window.setTimeout(() => {
    osc.stop();
    outputVCA.disconnect();
  }, time - audioCtx.currentTime + 1000);

  return outputVCA;
}
