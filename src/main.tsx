import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppNotifications from "./components/AppNotifications/AppNotifications.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppNotifications />
    <App />
  </StrictMode>
);
