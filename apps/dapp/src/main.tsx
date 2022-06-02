import "./styles/index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
