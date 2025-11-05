import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Safely import and register PWA
let updateSW;
async function registerPWA() {
  try {
    const { registerSW } = await import("virtual:pwa-register");
    updateSW = registerSW({
      onNeedRefresh() {
        console.log("New content available! Reload to update.");
      },
      onOfflineReady() {
        console.log("App ready to work offline 💪");
      },
    });
  } catch (error) {
    console.warn("PWA not supported or registration failed:", error);
  }
}

// Only attempt PWA registration in production or when explicitly enabled
if (import.meta.env.MODE === 'production' || import.meta.env.VITE_ENABLE_PWA === 'true') {
  registerPWA();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);