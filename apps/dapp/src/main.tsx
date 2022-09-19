import App from "./App";
import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
