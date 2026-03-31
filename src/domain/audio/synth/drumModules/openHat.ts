// @ts-nocheck
import HiHat from "synth/drumModules/hiHat";
import { equalPower } from "helpers";

export default function openHat(audioCtx, destination, time, { level, decay }) {
  // Parameters.
  const outputLevel = equalPower(level);
  const decayValue = decay * 3.6 + 90;

  return HiHat(audioCtx, destination, time, outputLevel, decayValue);
}
