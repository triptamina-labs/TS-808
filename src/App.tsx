import * as React from "react";

import { runtimeEnv } from "app/config/runtimeEnv";
import { KnobOverlayManager } from "components/knob/overlay";
import AppLayout from "layouts/app";

const Sequencer = React.lazy(() => import("domain/audio/sequencer"));
const WEBFONT_STYLE_ID = "io808-webfonts";
const FATHOM_SCRIPT_ID = "fathom-script";

function injectWebFontFace(baseUrl: string) {
  if (document.getElementById(WEBFONT_STYLE_ID) != null) {
    return;
  }

  const style = document.createElement("style");
  style.id = WEBFONT_STYLE_ID;
  style.textContent = `
    @font-face {
      font-family: "Helvetica LT W04";
      src: url("${baseUrl}/Fonts/1489428/5e04826f-5440-42ee-82bb-b212cb16bccc.woff2") format("woff2"),
           url("${baseUrl}/Fonts/1489428/e0eda329-a6eb-46ac-8f15-e1c54de80856.woff") format("woff");
      font-weight: 300;
      font-display: swap;
    }
    @font-face {
      font-family: "Helvetica LT W04";
      src: url("${baseUrl}/Fonts/1489440/44a857e5-bb9c-4164-a9f8-82e0390eaf0f.woff2") format("woff2"),
           url("${baseUrl}/Fonts/1489440/4deeb3d8-6eff-48da-9238-9220bb4a35f0.woff") format("woff");
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: "Helvetica LT W04";
      src: url("${baseUrl}/Fonts/1489456/5b00a1f2-3a6d-4922-a126-bde89e7f683c.woff2") format("woff2"),
           url("${baseUrl}/Fonts/1489456/0b6078b5-b3d8-46ee-a22e-5197ae487290.woff") format("woff");
      font-weight: 700;
      font-display: swap;
    }
    @font-face {
      font-family: "ITC Serif Gothic W03";
      src: url("${baseUrl}/Fonts/1551836/2715f30a-75b0-4b8d-b3d6-775e708c31bb.woff2") format("woff2"),
           url("${baseUrl}/Fonts/1551836/fa83b016-2709-4c67-a3c7-26c3c92c61fb.woff") format("woff");
      font-weight: 700;
      font-display: swap;
    }
  `;

  document.head.appendChild(style);
}

function initFathomTracker(trackerURL: string, siteID: string) {
  const trackerWindow = window as Window & {
    fathom?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  };

  if (trackerWindow.fathom == null) {
    const queuedFn = ((...args: unknown[]) => {
      queuedFn.q = queuedFn.q ?? [];
      queuedFn.q.push(args);
    }) as ((...args: unknown[]) => void) & { q?: unknown[][] };
    trackerWindow.fathom = queuedFn;
  }

  if (document.getElementById(FATHOM_SCRIPT_ID) == null) {
    const script = document.createElement("script");
    script.async = true;
    script.src = trackerURL;
    script.id = FATHOM_SCRIPT_ID;
    document.head.appendChild(script);
  }

  trackerWindow.fathom("set", "siteId", siteID);
  trackerWindow.fathom("trackPageview");
}

function App() {
  React.useLayoutEffect(() => {
    if ("performance" in window && "mark" in window.performance) {
      performance.mark("first_layout_render");
    }

    const loaderElement = document.getElementById("loader");
    const rootElement = document.getElementById("root");
    if (loaderElement != null) {
      loaderElement.addEventListener("transitionend", () => {
        loaderElement.parentNode?.removeChild(loaderElement);
      });
      loaderElement.className = "loader-wrapper done";
    }
    if (rootElement != null) {
      rootElement.className = "";
    }
  }, []);

  React.useEffect(() => {
    if (runtimeEnv.webfontBaseUrl != null) {
      injectWebFontFace(runtimeEnv.webfontBaseUrl);
    }

    if (runtimeEnv.fathomTrackerUrl != null && runtimeEnv.fathomSiteId != null) {
      initFathomTracker(runtimeEnv.fathomTrackerUrl, runtimeEnv.fathomSiteId);
    }
  }, []);

  return (
    <KnobOverlayManager>
      <div style={{ width: "100%", height: "100%" }}>
        <React.Suspense fallback={null}>
          <Sequencer />
        </React.Suspense>
        <AppLayout />
      </div>
    </KnobOverlayManager>
  );
}

export default App;
