import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppProviders } from "app/providers/AppProviders";

import App from "./App";

describe("App", () => {
  it("renderiza el layout principal", () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>
    );
    expect(screen.getByText("Reset")).toBeDefined();
  });
});
