import * as React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { Dispatch } from "redux";

import { onBlinkTick, onTick } from "actionCreators";
import type { AppAction } from "actionTypes";
import AudioCtxContext, { type WAAClockEventLike, type WAAClockLike } from "audioCtxContext";
import type { RootState } from "domain/state/types";
import { equalPower } from "helpers";
import VCA from "synth/basics/vca";
import Limiter from "synth/effects/limiter";
import stepTrigger from "synth/stepTrigger";

function getAudio(
  getClock: () => WAAClockLike | undefined,
  getAudioCtx: () => AudioContext | undefined
): { clock: WAAClockLike; ctx: AudioContext } | null {
  const clock = getClock();
  const audioCtx = getAudioCtx();
  if (clock != null && audioCtx != null) {
    return { clock, ctx: audioCtx };
  }
  return null;
}

function useSequencerActions() {
  const dispatch = useDispatch<Dispatch<AppAction>>();

  return React.useMemo(
    () => ({
      handleTick: () => {
        dispatch(onTick());
      },
      handleBlinkTick: () => {
        dispatch(onBlinkTick());
      }
    }),
    [dispatch]
  );
}

type OutputChain = {
  outputLimiter: {
    connect: (node: AudioNode) => void;
  };
  outputGain: {
    amplitude: {
      value: number;
    };
    connect: (node: unknown) => void;
  };
};

const Sequencer = React.memo(() => {
  // Inputs ===========
  const playing = useSelector((state: RootState) => state.playing);
  const tempo = useSelector((state: RootState) => state.tempo);
  const fineTempo = useSelector((state: RootState) => state.fineTempo);
  const masterVolume = useSelector((state: RootState) => state.masterVolume);
  const store = useStore<RootState>();
  const { handleTick: tickAction, handleBlinkTick: blinkTickAction } = useSequencerActions();
  const { getAudioContext, getClock } = React.useContext(AudioCtxContext);

  // Instance refs ===========
  const tickEventRef = React.useRef<WAAClockEventLike | null>(null);
  const masterVolumeRef = React.useRef(masterVolume);
  const outputChainRef = React.useRef<OutputChain | null>(null);
  const currentTempoRef = React.useRef<number | null>(null);

  // Methods ===========
  const handleBlinkTick = React.useCallback(() => {
    blinkTickAction();
  }, [blinkTickAction]);

  const handleTick = React.useCallback(
    ({ deadline }: { deadline: number }) => {
      const stateSnapshot = store.getState();
      const outputChain = outputChainRef.current;
      const masterVolume = masterVolumeRef.current;

      const clock = getClock();
      const audioCtx = getAudioContext();
      if (clock == null || audioCtx == null) {
        return;
      }

      let currentOutputChain = outputChain != null ? { ...outputChain } : null;
      if (currentOutputChain == null) {
        // Create limiter before output to protect from clipping.
        const outputLimiter = new Limiter(audioCtx) as unknown as OutputChain["outputLimiter"];
        outputLimiter.connect(audioCtx.destination);

        // Output gain for masterVolume control.
        const outputGain = new VCA(audioCtx) as unknown as OutputChain["outputGain"];
        outputGain.amplitude.value = equalPower(masterVolume);
        outputGain.connect(outputLimiter);

        currentOutputChain = { outputLimiter, outputGain };
        outputChainRef.current = currentOutputChain;
      }

      stepTrigger(stateSnapshot, deadline, currentOutputChain.outputGain, clock, audioCtx);

      clock.setTimeout(() => {
        tickAction();
      }, deadline - audioCtx.currentTime);
    },
    [getAudioContext, getClock, store, tickAction]
  );

  // Effects ===========
  // Blink tick interval.
  React.useEffect(() => {
    if (!playing) {
      return;
    }

    const blinkIntervalID = window.setInterval(handleBlinkTick, 750);
    return () => {
      window.clearInterval(blinkIntervalID);
    };
  }, [handleBlinkTick, playing]);

  // Start sequencer.
  React.useEffect(() => {
    const audio = getAudio(getClock, getAudioContext);
    const tickEvent = tickEventRef.current;

    if (audio != null && playing && tickEvent === null) {
      audio.clock.start();

      const currentTempo = tempo + fineTempo;
      const beatDuration = 60 / currentTempo / 4;

      const newTickEvent = audio.clock
        .callbackAtTime(handleTick, audio.ctx.currentTime + 0.1)
        .repeat(beatDuration)
        .tolerance({ late: 0.01 });

      tickEventRef.current = newTickEvent;
      currentTempoRef.current = currentTempo;
    }
  }, [fineTempo, getAudioContext, getClock, handleTick, playing, tempo]);

  // Stop sequencer.
  React.useEffect(() => {
    const audio = getAudio(getClock, getAudioContext);
    const tickEvent = tickEventRef.current;

    if (audio != null && !playing && tickEvent !== null) {
      tickEvent.clear();
      audio.clock.stop();

      tickEventRef.current = null;
      currentTempoRef.current = null;
    }
  }, [getAudioContext, getClock, playing]);

  // Change tempo.
  React.useEffect(() => {
    const currentTempo = currentTempoRef.current;
    const tickEvent = tickEventRef.current;
    const audio = getAudio(getClock, getAudioContext);
    const newTempo = tempo + fineTempo;

    if (
      audio != null &&
      tickEvent != null &&
      playing &&
      currentTempo != null &&
      currentTempo !== newTempo
    ) {
      audio.clock.timeStretch(audio.ctx.currentTime, [tickEvent], currentTempo / newTempo);
      currentTempoRef.current = newTempo;
    }
  }, [fineTempo, getAudioContext, getClock, playing, tempo]);

  // Change master volume.
  React.useEffect(() => {
    const outputChain = outputChainRef.current;

    if (masterVolume !== masterVolumeRef.current) {
      if (outputChain != null) {
        outputChain.outputGain.amplitude.value = equalPower(masterVolume);
      }
      masterVolumeRef.current = masterVolume;
    }
  }, [masterVolume]);

  // No-op render.
  return null;
});

export default Sequencer;
