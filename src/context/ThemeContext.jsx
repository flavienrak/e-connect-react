import { createContext } from "react";
import { useSelector } from "react-redux";

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const { theme, mode } = useSelector((state) => state.persistInfos);

  return (
    <ThemeContext.Provider value={{ theme, mode }}>
      <div
        className={`${
          theme === "green"
            ? "greenTheme"
            : theme === "yellow"
            ? "yellowTheme"
            : theme === "blue"
            ? "blueTheme"
            : theme === "red"
            ? "redTheme"
            : "defaultTheme"
        }`}
      >
        <div className={`${mode === "dark" ? "darkMode" : "lightMode"}`}>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
