"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return {
    theme: mounted ? theme : undefined,
    toggleTheme,
    mounted,
  };
}
