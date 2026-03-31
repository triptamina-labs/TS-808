import type { CSSProperties } from "react";

type IconProps = {
  size?: number;
  color?: string;
  style?: CSSProperties;
  title?: string;
};

function iconBaseStyle(size: number, color: string, style?: CSSProperties): CSSProperties {
  return {
    display: "block",
    width: size,
    height: size,
    color,
    ...style
  };
}

export function DownloadIcon({ size = 24, color = "currentColor", style, title = "Save" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      style={iconBaseStyle(size, color, style)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function UploadIcon({ size = 24, color = "currentColor", style, title = "Load" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      style={iconBaseStyle(size, color, style)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21V9" />
      <path d="M7 14l5-5 5 5" />
      <path d="M4 4h16" />
    </svg>
  );
}

export function HeartIcon({ size = 16, color = "currentColor", style, title = "Heart" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      style={iconBaseStyle(size, color, style)}
      fill="currentColor"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
    </svg>
  );
}
