import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/core/theme.css";
import "./styles/core/layout.css";
import "./styles/components/components.css";
import "./styles/brand/brand.css";
import "./styles/features/comments.css";
import "./styles/features/home.css";
import "./styles/features/gallery.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
