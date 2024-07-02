import { createContext } from "react";
import { useSelector } from "react-redux";

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const { theme, mode } = useSelector((state) => state.persistInfos);

  return (
    <ThemeContext.Provider value={{ theme, mode }}>
      <div
        className={`${
          theme === "purple"
            ? "purpleTheme"
            : theme === "green"
            ? "greenTheme"
            : theme === "yellow"
            ? "yellowTheme"
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
