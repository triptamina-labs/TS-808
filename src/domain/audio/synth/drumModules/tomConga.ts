// @ts-nocheck
import ADGenerator, { LINEAR } from "synth/basics/ADGenerator";
import PulseTrigger from "synth/basics/pulseTrigger";
import VCA from "synth/basics/vca";
import VCF, { LOWPASS } from "synth/basics/vcf";
import VCO, { PINK_NOISE, SINE } from "synth/basics/vco";
import { equalPower } from "helpers";

// 0 = conga, 1 = tom
const parameterMap = {
  low: [
    {
      frequencies: [220, 165],
      decay: [180, 200]
    },
    {
      frequencies: [100, 80],
      decay: [200, 200]
    }
  ],

  mid: [
    {
      frequencies: [310, 250],
      decay: [100, 155]
    },
    {
      frequencies: [160, 120],
      decay: [130, 155]
    }
  ],

  high: [
    {
      frequencies: [455, 370],
      decay: [180, 125]
    },
    {
      frequencies: [220, 165],
      decay: [200, 125]
    }
  ]
};

export default function tomConga(type) {
  return function triggerTomConga(audioCtx, destination, time, { level, tuning, selector }) {
    // Parameters.
    const {
      frequencies: [highFreq, lowFreq],
      decay: [oscDecay, noiseDecay]
    } = parameterMap[type][selector];
    const oscFreq = (tuning / 100) * (highFreq - lowFreq) + lowFreq;
    const outputLevel = equalPower(level / 4);

    // Audio modules.
    const osc = new VCO(SINE, audioCtx);
    osc.frequency.value = oscFreq;

    const noiseOsc = new VCO(PINK_NOISE, audioCtx);

    const click = new PulseTrigger(audioCtx);
    click.gain.amplitude.value = 0.3;

    const noiseVCF = new VCF(LOWPASS, audioCtx);
    noiseVCF.frequency.value = 10000;

    const oscVCA = new VCA(audioCtx);
    const noiseVCA = new VCA(audioCtx);

    const outputVCA = new VCA(audioCtx);
    outputVCA.amplitude.value = outputLevel;

    // Envelopes.
    const oscEnv = new ADGenerator(LINEAR, 0.1, oscDecay, 0, 1);
    const noiseEnv = new ADGenerator(LINEAR, 0.1, noiseDecay, 0, 0.2);

    // Audio routing.
    osc.connect(oscVCA);
    oscVCA.connect(outputVCA);

    if (selector === 1) {
      // Only toms get noise.
      noiseOsc.connect(noiseVCF);
      noiseVCF.connect(noiseVCA);
      noiseVCA.connect(outputVCA);
    }

    click.connect(outputVCA);

    // Modulation routing.
    oscEnv.connect(oscVCA.amplitude);
    noiseEnv.connect(noiseVCA.amplitude);

    // Output routing.
    outputVCA.connect(destination);

    // Trigger.
    osc.start(time);
    noiseOsc.start(time);
    click.trigger(time, audioCtx);

    oscEnv.trigger(time);
    noiseEnv.trigger(time);

    // Cleanup.
    window.setTimeout(() => {
      osc.stop();
      noiseOsc.stop();
      outputVCA.disconnect();
    }, time - audioCtx.currentTime + 1000);

    return outputVCA;
  };
}
