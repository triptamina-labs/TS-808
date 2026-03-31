// @ts-nocheck
import HiHat from "synth/drumModules/hiHat";
import { equalPower } from "helpers";

export default function clsdHat(audioCtx, destination, time, { level }) {
  // Parameters.
  const outputLevel = equalPower(level);
  const decay = 50;

  return HiHat(audioCtx, destination, time, outputLevel, decay);
}
