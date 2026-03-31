import { createContext } from "react";

import WAAClock from "waaclock";

export interface WAAClockEventLike {
  repeat: (interval: number) => WAAClockEventLike;
  tolerance: (config: { late: number }) => WAAClockEventLike;
  clear: () => void;
}

export interface WAAClockLike {
  start: () => void;
  stop: () => void;
  setTimeout: (callback: () => void, delay: number) => void;
  callbackAtTime: (
    callback: (event: { deadline: number }) => void,
    time: number
  ) => WAAClockEventLike;
  timeStretch: (time: number, events: Array<WAAClockEventLike | null>, ratio: number) => void;
}

type ClockCtor = new (audioCtx: AudioContext, options?: { toleranceEarly?: number }) => WAAClockLike;

let audioCtx: AudioContext | undefined;
let clock: WAAClockLike | undefined;

function triggerSilentAudio(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);

  const sourceWithLegacyApi = source as AudioBufferSourceNode & {
    play?: (time: number) => void;
    noteOn?: (time: number) => void;
  };

  if (source.start) {
    source.start(0);
  } else if (sourceWithLegacyApi.play) {
    sourceWithLegacyApi.play(0);
  } else if (sourceWithLegacyApi.noteOn) {
    sourceWithLegacyApi.noteOn(0);
  }
}

const AudioCtxContext = createContext({
  getAudioContext: () => audioCtx,
  getClock: () => clock,
  requestInit: () => {
    if (audioCtx == null || clock == null) {
      // Prefix fallback for legacy webkit implementations.
      const AudioContextCtor = (
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      ) as typeof AudioContext;

      audioCtx = new AudioContextCtor();
      triggerSilentAudio(audioCtx);

      clock = new (WAAClock as unknown as ClockCtor)(audioCtx, { toleranceEarly: 0.09 });
    }
  }
});

export default AudioCtxContext;
