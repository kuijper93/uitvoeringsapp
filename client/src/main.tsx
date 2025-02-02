import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

// Ensure the app is wrapped in StrictMode for better development experience
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);