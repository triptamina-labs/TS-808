// @ts-nocheck
// Constants
import {
  ACCENT,
  BASS_DRUM,
  CLAVES_RIMSHOT,
  CLSD_HIHAT,
  COWBELL,
  CYMBAL,
  HI_CONGA_HI_TOM,
  LOW_CONGA_LOW_TOM,
  MARACAS_HANDCLAP,
  MID_CONGA_MID_TOM,
  OPEN_HIHAT,
  SNARE_DRUM
} from "store-constants";

// Drum modules
import VCA from "synth/basics/vca";
import bassDrum from "synth/drumModules/bassDrum";
import clsdHat from "synth/drumModules/clsdHat";
import claveRimshot from "synth/drumModules/claveRimshot";
import cowbell from "synth/drumModules/cowbell";
import cymbal from "synth/drumModules/cymbal";
import maracasHandclap from "synth/drumModules/maracasHandclap";
import openHat from "synth/drumModules/openHat";
import snareDrum from "synth/drumModules/snareDrum";
import tomConga from "synth/drumModules/tomConga";

// Selectors
import { getCurrentPart } from "selectors/common";
import patternSelector from "selectors/pattern";
import stepSelector from "selectors/step";
import variationSelector from "selectors/variation";

// Helpers
import { equalPower, stepKey } from "helpers";

const drumModuleMapping = [
  [BASS_DRUM, bassDrum],
  [SNARE_DRUM, snareDrum],
  [LOW_CONGA_LOW_TOM, tomConga("low")],
  [MID_CONGA_MID_TOM, tomConga("mid")],
  [HI_CONGA_HI_TOM, tomConga("high")],
  [CLAVES_RIMSHOT, claveRimshot],
  [MARACAS_HANDCLAP, maracasHandclap],
  [COWBELL, cowbell],
  [CYMBAL, cymbal],
  [OPEN_HIHAT, openHat],
  [CLSD_HIHAT, clsdHat]
];

/*
 * Store a cache of the previous output VCAs so that we can silence them before the new drum is triggered.
 */
const previousTriggers = {
  [BASS_DRUM]: null,
  [SNARE_DRUM]: null,
  [LOW_CONGA_LOW_TOM]: null,
  [MID_CONGA_MID_TOM]: null,
  [HI_CONGA_HI_TOM]: null,
  [CLAVES_RIMSHOT]: null,
  [MARACAS_HANDCLAP]: null,
  [COWBELL]: null,
  [CYMBAL]: null,
  [OPEN_HIHAT]: null,
  [CLSD_HIHAT]: null
};

function getAccentGain(currentPattern, currentPart, currentVariation, currentStep, storeState) {
  const stepId = stepKey(currentPattern, ACCENT, currentPart, currentVariation, currentStep);
  const accentActive = storeState.steps[stepId];

  const accentLevel = storeState.instrumentState[ACCENT].level;
  const inactiveGainAmt = equalPower(100 - accentLevel / 1.5);

  return accentActive ? 1.0 : inactiveGainAmt;
}

export default function stepTrigger(storeState, deadline, destination, clock, audioCtx) {
  // Select relevant values from the global state.
  const currentPattern = patternSelector(storeState);
  const currentPart = getCurrentPart(storeState);
  const currentVariation = variationSelector(storeState);
  const currentStep = stepSelector(storeState);

  // Accent destination node.
  const accentGain = getAccentGain(
    currentPattern,
    currentPart,
    currentVariation,
    currentStep,
    storeState
  );
  const accentVCA = new VCA(audioCtx);
  accentVCA.amplitude.value = accentGain;
  accentVCA.connect(destination);

  // accentVCA cleanup
  window.setTimeout(() => {
    accentVCA.disconnect();
  }, deadline - audioCtx.currentTime + 2000);

  drumModuleMapping.forEach(([drumID, drumModuleTrigger]) => {
    const stepID = stepKey(currentPattern, drumID, currentPart, currentVariation, currentStep);
    const drumState = storeState.instrumentState[drumID];

    if (storeState.steps[stepID]) {
      // Set gain on previous triggers to zero.
      if (previousTriggers[drumID] != null) {
        const prevModule = previousTriggers[drumID];
        prevModule.amplitude.cancelScheduledValues(audioCtx.currentTime);
        prevModule.amplitude.setValueAtTime(prevModule.amplitude.value, audioCtx.currentTime);
        prevModule.amplitude.linearRampToValueAtTime(0, deadline);

        // Remove reference from cache so GC can clean it up.
        previousTriggers[drumID] = null;
      }

      // Start a new trigger and store output gain node in cache.
      previousTriggers[drumID] = drumModuleTrigger(audioCtx, accentVCA, deadline, drumState);
    }
  });
}
