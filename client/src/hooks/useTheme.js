import { useEffect, useState } from "react";

const STORAGE_KEY = "secureshare-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_KEY) || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
