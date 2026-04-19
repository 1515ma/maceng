import React from "react";

let currentTheme = "light";

export const useTheme = () => ({
  theme: currentTheme,
  setTheme: (t: string) => { currentTheme = t; },
  resolvedTheme: currentTheme,
  themes: ["light", "dark"],
  systemTheme: "light",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const __setMockTheme = (t: string) => { currentTheme = t; };
