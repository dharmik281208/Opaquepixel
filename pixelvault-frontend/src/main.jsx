import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { getInitialTheme, applyTheme } from "./utils/theme";

applyTheme(getInitialTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
