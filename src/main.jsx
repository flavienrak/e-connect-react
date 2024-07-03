import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UidContextProvider from "./context/UidContext.jsx";
import ReduxProvider from "./redux/ReduxProvider.jsx";
import ThemeContextProvider from "./context/ThemeContext.jsx";

import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider>
      <Router>
        <ThemeContextProvider>
          <UidContextProvider>
            <App />
          </UidContextProvider>
        </ThemeContextProvider>
      </Router>
    </ReduxProvider>
  </React.StrictMode>
);
