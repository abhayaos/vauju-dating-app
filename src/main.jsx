import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PWAProvider } from "./context/PWAContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PWAProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PWAProvider>
);