declare module "waaclock" {
  interface WAAClockEvent {
    repeat: (interval: number) => WAAClockEvent;
    tolerance: (config: { late: number }) => WAAClockEvent;
    clear: () => void;
  }

  export default class WAAClock {
    constructor(audioCtx: AudioContext, options?: { toleranceEarly?: number });
    start(): void;
    stop(): void;
    setTimeout(callback: () => void, delay: number): void;
    callbackAtTime(
      callback: (event: { deadline: number }) => void,
      time: number
    ): WAAClockEvent;
    timeStretch(time: number, events: Array<WAAClockEvent | null>, ratio: number): void;
  }
}
