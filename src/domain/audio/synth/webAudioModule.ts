// @ts-nocheck
import { mixin } from "helpers";

// WebAudio module decorator to add a consistent `connect` function between modules.
export default mixin({
  connect(node) {
    if (node.hasOwnProperty("input")) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  },

  disconnect() {
    this.output.disconnect();
  }
});
