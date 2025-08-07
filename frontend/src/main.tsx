import React from "react";
import ReactDOM from "react-dom/client";

import "./scss/styles.scss";
import AppRoutes from "./appRoutes";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
